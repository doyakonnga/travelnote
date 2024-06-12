'use client'

import { ReactElement, ReactNode, useEffect, useState } from "react"
import Spinner from "./spinner"
import Alert from "./alert"
import { randomBytes } from "crypto"
import { RiFolderAddLine } from "react-icons/ri"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"

const InputModal = ({ text, loading, handleOk, handleCancel }: {
  text: string
  loading: boolean
  handleOk: (input: string) => void
  handleCancel: () => void
}) => {
  const [input, setInput] = useState('')

  return (
    <div className="fixed inset-0 m-0 z-20 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="z-30 bg-white p-4 gap-1 rounded flex flex-col justify-center items-center w-80">
        <h1>{text}</h1>
        <input type="text" id="input" placeholder="name" value={input} onChange={(e) => setInput(e.target.value)} />
        {loading ? <Spinner /> :
          <div className="flex justify-between gap-x-8 ">
            <button type='button' className="my-3 w-20 flex justify-center bg-gray-800 text-white p-2 rounded-md tracking-wide hover:bg-black focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200" onClick={() => { handleOk(input) }}>
              OK
            </button>
            <button type="button" className="my-3 w-20 flex justify-center bg-gray-100 text-stone-800 p-2 rounded-md tracking-wide hover:bg-neutral-50 focus:outline-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-50 transition-colors duration-200"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>}
      </div>
    </div>
  )
}

export const AddingAlbumModal = () => {
  const router = useRouter()
  const { journeyId } = useParams<{ journeyId: string }>()
  const [loading, setLoading] = useState(false)
  const [modalText, setModalText] = useState('')
  const [result, setResult] = useState<{
    state: 'success' | 'failure' | ''; id: string
  }>({ state: '', id: '' })

  return (
    <div>
      <RiFolderAddLine
        className="p-1 hover:bg-gray-100 absolute bottom-4 right-4 rounded-md text-4xl"
        onClick={() => {
          setModalText("Create a new album: ")
          setResult({ state: '', id: '' })
        }}
      />
      {modalText ?
        <InputModal
          text={modalText}
          loading={loading}
          handleOk={async (input: string) => {
            try {
              setLoading(true)
              await axios.post('/api/v1/albums', { journeyId, name: input })
              setResult({ state: 'success', id: randomBytes(4).toString() })
              router.refresh()
            } catch (e) {
              console.log(e)
              setResult({ state: 'failure', id: randomBytes(4).toString() })
            } finally {
              setModalText('')
              setLoading(false)
            }
          }}
          handleCancel={() => {
            setModalText('')
          }}
        />
        : result.state === 'success' ?
          <Alert color="green" id={result.id}>Operation success</Alert>
          : result.state === 'failure' ?
            <Alert color="red" id={result.id}>Operation failure</Alert>
            : <></>}
    </div>)
}

export default InputModal
