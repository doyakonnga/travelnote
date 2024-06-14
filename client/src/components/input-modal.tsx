'use client'

import { ReactElement, ReactNode, useEffect, useRef, useState } from "react"
import Spinner from "./spinner"
import Alert from "./alert"
import { randomBytes } from "crypto"
import { RiFolderAddLine } from "react-icons/ri"
import { TbEdit } from "react-icons/tb";
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import ConfirmModal from "./confirm-modal"

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
        <input type="text" id="input" placeholder="name" className="border-b-2"
          value={input} onChange={(e) => setInput(e.target.value)} />
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

export const EditingAlbumModal = ({ albums }: { albums: Album[] }) => {
  const router = useRouter()
  const { journeyId } = useParams<{ journeyId: string }>()
  const albumMenu = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [loading, setLoading] = useState(false)
  const [modalContent, setModalContent] = useState<{
    action: 'rename' | 'delete'; text: string
  } | null>(null)
  const [result, setResult] = useState<{
    state: 'success' | 'failure' | ''; id: string; msg: string
  }>({ state: '', id: '', msg: '' })
  const handleReset = () => {
    setExpanded(false)
    setSelectedAlbum(null)
    setModalContent(null)
  }

  return (
    <div>
      {/* toggle album menu */}
      <div className="absolute bottom-4 right-14 ">
        <TbEdit
          className="p-1 hover:bg-gray-100 rounded-md text-4xl"
          onClick={() => { setExpanded(p => !p) }}
        />
        {/* album menu */}
        <div
          id="dropdown-menu" ref={albumMenu}
          className={"absolute right-0 bottom-7 space-y-2 w-72 p-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 "
            + (expanded ? '' : 'hidden')}
        >
          <h1 className="p-1 font font-medium">Select an album: </h1>
          {albums.filter(a => a.name !== 'unclassified').map((album) => (
            <p
              key={album.id}
              className={"block px-4 py-2 mb-1 text-sm text-gray-900 rounded-md " +
                (album === selectedAlbum ? 'bg-sky-300' : 'bg-white hover:bg-gray-300')}
              role="menuitem"
              onClick={() => { setSelectedAlbum(album) }}
            >
              {album.name}
            </p>))
          }
          {selectedAlbum &&
            <div className="flex justify-between py-1">
              <button
                type="button"
                id="submit-button"
                className="w-20 px-2 py-1 bg-rose-400 text-black rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  setModalContent({
                    action: 'delete',
                    text: `All of the remained photos will be move to "unclassified", Are you sure you want to delete the album: "${selectedAlbum.name}"?`
                  })
                }}
              >
                Delete
              </button>
              <button
                type="button"
                id="submit-button"
                className="w-20 px-2 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  setModalContent({
                    action: 'rename',
                    text: `New name of the album "${selectedAlbum.name}": `
                  })
                }}
              >
                Rename
              </button>
              <button
                type="button"
                id="submit-button"
                className="w-20 px-2 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleReset}
              >
                Cancel
              </button>
            </div>}
        </div>
      </div>
      {/* rename input modal */}
      {modalContent && modalContent.action === 'rename' &&
        <InputModal
          text={modalContent.text}
          loading={loading}
          handleOk={async (input: string) => {
            try {
              if (!selectedAlbum) return
              setLoading(true)
              await axios.patch(`/api/v1/albums/${selectedAlbum.id}`, {
                journeyId, name: input
              })
              setResult({
                state: 'success', id: randomBytes(4).toString(),
                msg: `The album: ${selectedAlbum.name} has been renamed successfully.`
              })
              router.refresh()
            } catch (e) {
              console.log(e)
              setResult({
                state: 'failure', id: randomBytes(4).toString(),
                msg: 'Operation failed, please try again later.'
              })
            } finally {
              handleReset()
              setLoading(false)
            }
          }}
          handleCancel={handleReset}
        />
      }
      {/* delete confirm modal */}
      {modalContent?.action === 'delete' &&
        <ConfirmModal
          text={modalContent.text}
          loading={loading}
          handleOk={async () => {
            try {
              if (!selectedAlbum) return
              setLoading(true)
              await axios.delete(`/api/v1/albums/${selectedAlbum.id}`)
              setResult({
                state: 'success', id: randomBytes(4).toString(),
                msg: `The album: ${selectedAlbum.name} has been deleted successfully.`
              })
              router.refresh()
            } catch (e) {
              console.log(e)
              setResult({
                state: 'failure', id: randomBytes(4).toString(),
                msg: 'Operation failed, please try again later.'
              })
            } finally {
              handleReset()
              setLoading(false)
            }
          }}
          handleCancel={handleReset}
        />
      }
      {/* Alert */}
      {result.state === 'success' ?
        <Alert color="green" id={result.id}>{result.msg}</Alert>
        : result.state === 'failure' ?
          <Alert color="red" id={result.id}>{result.msg}</Alert>
          : <></>
      }
    </div>
  )
}

export default InputModal
