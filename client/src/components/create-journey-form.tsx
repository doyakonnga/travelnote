'use client'
import Image from "next/image"
import { ChangeEvent, useState } from "react"
import { getUploadUrl } from "./actions"
import axios from "axios"
import { Sha256 } from '@aws-crypto/sha256-browser'
import { randomBytes } from "crypto"
import Alert from "./alert"
const CreateJourneyForm = () => {
  const [object, setObject] = useState<File | undefined>(undefined)
  const [objectUrl, setObjectUrl] = useState('')
  const [errorMsg, setErrMsg] = useState('')
  const [errorId, setErrId] = useState('')

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (objectUrl) URL.revokeObjectURL(objectUrl)
    const file = e.target.files?.[0]
    setObject(file)

    if (file) {
      setObjectUrl(URL.createObjectURL(file))
    } else {
      return setObjectUrl('')
    }
    console.log(`[${file.name}, ${objectUrl}]`)

    try {
      const { type, size } = file
      const hash = new Sha256();
      hash.update(await file.arrayBuffer());
      const buf = await hash.digest()
      // const buf = await crypto.subtle.digest('sha256', await file.arrayBuffer());
      // crypto.subtle is undefined when not using https
      const checkSum = Array.from(new Uint8Array(buf)).
        map((b) => b.toString(16).padStart(2, '0')).join('')

      const url = await getUploadUrl(type, size, checkSum)
      if (typeof url !== 'string') throw Error(url.error)
      await axios.put(url, file,
        { headers: { "Content-Type": file.type } })
    } catch (e) {
      console.log('e into catch')
      if (e instanceof Error) {
        setErrMsg(e.message)
        setErrId(randomBytes(4).toString('ascii'))
        setObject(undefined)
        setObjectUrl('')
      }
      console.log(e)
    }
  }

  return (
    <form className="mt-8 space-y-3" action="#" method="POST">
      {errorId && errorMsg &&
        <Alert color={'red'} id={errorId}>{errorMsg}</Alert>
      }
      <div className="grid grid-cols-1 space-y-2">
        <label className="text-sm font-bold text-gray-500 tracking-wide">
          Title
        </label>
        <input
          className="text-base p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          type=""
          placeholder="mail@gmail.com"
        />
      </div>
      <div className="grid grid-cols-1 space-y-2">
        <label className="text-sm font-bold text-gray-500 tracking-wide">
          Attach Document
        </label>
        {(!objectUrl &&
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
              <div className="h-full w-full text-center flex flex-col items-center justify-center items-center  ">
                <div className="flex flex-auto max-h-48 w-2/5 mx-auto -mt-10">
                  <img
                    className="has-mask h-36 object-center"
                    src="https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg"
                    alt="freepik image"
                  />
                </div>
                <p className="pointer-none text-gray-500 ">
                  <span className="text-sm">Drag and drop</span> files here{" "}
                  <br /> or{" "}
                  <span className="text-blue-600 hover:underline">
                    select a file
                  </span>{" "}
                  from your computer
                </p>
              </div>
              <input type="file" className="hidden" name="picture"
                onChange={handleFileInputChange}
              />
            </label>
          </div>)}

        {objectUrl && (
          <div className='flex relative'>
            <Image
              src={objectUrl}
              alt='selected image'
              width={500}
              height={500}
            />
            <button type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 absolute right-0 top-0"
              onClick={() => {
                setObject(undefined)
                setObjectUrl('')
              }}
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

      </div>
      <p className="text-sm text-gray-300">
        <span>File type: images</span>
      </p>

      <div>
        <button
          type="submit"
          className="my-5 w-full flex justify-center bg-black text-white p-2 rounded-md tracking-wide hover:bg-gray-800 focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
        >
          Setup
        </button>
      </div>
    </form>
  )
}

export default CreateJourneyForm
