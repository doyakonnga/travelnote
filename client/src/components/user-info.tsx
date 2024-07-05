
'use client'

import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChangeEvent, useState } from "react"
import { Close } from "./svg"
import axios from "axios"
import { uploadToS3 } from "./client-action"
import { deleteFromS3, refresh, revalidatePath } from "./actions"
import { randomBytes } from "crypto"
import Spinner from "./spinner"
import Alert from "./alert"

const id = () => randomBytes(4).toString('ascii')
type Uploaded = { file: File, objectUrl: string } | null
type Res = {
  state: 'ok' | 'err';
  id: string;
  msg: string;
} | 'loading' | ''

const UserInfo = ({ user }: { user: Member }) => {
  const router = useRouter()
  const [name, setName] = useState(user.name || '')
  const [s3Avatar, setS3Avatar] = useState(user.avatar || '')
  const [uploaded, setUploaded] = useState<Uploaded>(null)
  const [res, setRes] = useState<Res>('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (uploaded) URL.revokeObjectURL(uploaded.objectUrl)
    const file = e.target.files?.[0];
    if (!file) setUploaded(null)
    else setUploaded({ file, objectUrl: URL.createObjectURL(file) })
  }
  const handleSubmit = async () => {
    try {
      if (!name.trim()) throw new Error('Please input valid name')
      setRes('loading')
      let newS3Url: string | undefined = undefined
      if (uploaded)
        newS3Url = await uploadToS3(uploaded.file)
      const { data } = await axios.patch(`/api/v1/user/${user.id}`, {
        name, avatar: newS3Url
      })
      if (s3Avatar !== data.user.avatar)
        deleteFromS3(s3Avatar)
      setName(data.user.name || '')
      setS3Avatar(data.user.avatar || '')
      setUploaded(null)
      setRes({ state: 'ok', id: id(), msg: 'User profile has been updated.' })
      refresh('/user')
    } catch (e) {
      const temp = { state: 'err' as const, id: id() }
      if (axios.isAxiosError(e))
        setRes({ ...temp, msg: JSON.stringify(e.response?.data) })
      else if (e instanceof Error)
        setRes({ ...temp, msg: e.message })
      else
        setRes({ ...temp, msg: 'uncaught errors, try again later' })
    } finally { console.log(res) }

  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <label htmlFor="file" className="">
        <div className="w-36 h-36 cursor-pointer mx-auto p-2">
          <a href={uploaded?.objectUrl || s3Avatar || '/user.png'} target="_blank">
            <img className="rounded-full h-full w-full object-cover"
              src={uploaded?.objectUrl || s3Avatar || '/user.png'}
              alt='user avatar'
            />
          </a>
        </div>
        <div className="mx-auto cursor-pointer">
          <span>File: {uploaded?.file.name || 'Select file'}</span>
          <input type="file" id="file" hidden onChange={handleChange} />
          {uploaded && <Close className="inline w-5"
            onClick={(e: MouseEvent) => {
              e.preventDefault()
              setUploaded(null)
            }} />}
        </div>

      </label>

      <h1 className="mt-2.5 mb-1">Email: {user.email}</h1>
      <div>
        <label htmlFor="name">Name: </label>
        <input id="name" type="text" className="w-32" value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      {typeof res !== 'string' &&
        <Alert color={res.state === 'ok' ? 'green' : 'red'} id={res.id}>
          {res.msg}
        </Alert>
      }
      {/* Buttons or Spinner */}
      {res === 'loading' ? <Spinner /> :
        <div className="flex justify-around gap-5">
          <button type="button" className="my-3 flex justify-center bg-gray-800 text-white p-2 rounded-md tracking-wide hover:bg-black focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200"
            onClick={() => handleSubmit()}
          >
            Save
          </button>
          <button type="button" className="my-3 flex justify-center bg-gray-100 text-stone-800 p-2 rounded-md tracking-wide hover:bg-neutral-50 focus:outline-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-50 transition-colors duration-200"
            onClick={() => router.push('/')}
          >
            Cancel
          </button>
        </div>}
    </div>
  )
}

export default UserInfo
