import Image from "next/image"
import { Add, Close, FileImage } from "./svg"
import { randomBytes } from "crypto"
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { uploadToS3 } from "./client-action"
import { deleteFromS3 } from "./actions"
import Spinner from "./spinner"

type ReqState = {
  res: 'ok' | 'err'
  id: string
  msg: string
} | 'loading' | ''
const id = () => randomBytes(4).toString('ascii')

export const MultipleFileUploadingModal = ({ reset, reqState, setReqState }: {
  reset: () => void
  reqState: ReqState
  setReqState: Dispatch<SetStateAction<ReqState>>
}) => {
  const router = useRouter()
  const { albumId }: { albumId: string } = useParams()
  const [modal, setModal] = useState(false)
  const [files, setFiles] = useState<{ file: File, objectUrl: string }[]>([])
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return setFiles([])
    const arr: { file: File, objectUrl: string }[] = []
    Array.from(e.target.files).forEach((f) =>
      arr.push({ file: f, objectUrl: URL.createObjectURL(f) }))
    if (arr.some(f => f.file.size > 10 * 1024 * 1024)) {
      setReqState({ res: 'err', id: id(), msg: 'Size; File size exceeded 10MB.' })
      return setModal(false)
    }
    setFiles(arr)
  }
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    const s3Urls: string[] = []
    try {
      if (!files.length) throw new Error('Please choose photos to upload.')
      setReqState('loading')
      await Promise.all(files.map(f => uploadToS3(f.file).then(url => s3Urls.push(url))))
      const { data } = await axios.post('/api/v1/photos/multiple', {
        albumId, urls: s3Urls
      })
      setReqState({ res: 'ok', id: id(), msg: `${data.count} photos have been uploaded successfully.` })
      setFiles([])
      setModal(false)
      router.refresh()
    } catch (e) {
      console.log(s3Urls)
      s3Urls.forEach(url => deleteFromS3(url).then(() => console.log('deleted')))
      const msg = e instanceof Error ? e.message : 'Error, please try again later.'
      setReqState({ res: 'err', id: id(), msg })
    }
  }
  const handleCandle = () => {
    setModal(false)
    setFiles([])
  }
  return (
    <div>
      <Add
        className="p-1 hover:bg-gray-100 absolute bottom-0 right-4 rounded-md text-4xl cursor-pointer"
        onClick={() => {
          reset()
          setModal(true)
        }}
      />
      {modal &&
        <div className="fixed inset-0 m-0 z-20 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
          <div className="z-30 bg-white p-4 gap-1 rounded flex flex-col justify-center items-center w-80 relative">
            {/* selected file avatars */}
            {!!files.length && reqState !== 'loading' &&
              <div className="flex flex-wrap gap-2 p-3">
                {files.map((f) => (
                  <div key={f.objectUrl} className="relative w-20 h-20 overflow-hidden shadow-md">
                    <Image className='object-cover' src={f.objectUrl} alt='uploaded photo' fill sizes='4rem'
                    />
                  </div>
                ))}
              </div>
            }
            {/* file input */}
            <label htmlFor="files" className="cursor-pointer">
              {'Select files: '}
              <FileImage className="p-1 hover:bg-gray-100 rounded-md text-4xl inline" />
            </label>
            <input id='files' type="file" multiple className='hidden'
              onChange={handleChange}
            />
            {/* buttons */}
            {!!files.length && reqState !== 'loading' &&
              <div className="flex w-full justify-around py-1">
                <button
                  type="button"
                  id="submit-button"
                  className="w-20 px-2 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleSubmit}
                >
                  Upload
                </button>
                <button
                  type="button"
                  id="submit-button"
                  className="w-20 px-2 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleCandle}
                >
                  Cancel
                </button>
              </div>}
            {reqState === 'loading' && <Spinner />}
            <Close className="absolute top-2 right-2" onClick={handleCandle}/>
          </div>
        </div>
      }
    </div>
  )
}