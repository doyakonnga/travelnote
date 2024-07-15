'use client'

import Image from "next/image"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ArrowRepeat, Close, TrashBin } from "./svg"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import Spinner from "./spinner"
import ConfirmModal from "./confirm-modal"
import Alert from "./alert"
import { randomBytes } from "crypto"
import { deleteFromS3 } from "./actions"
import { MultipleFileUploadingModal } from "./multiple-file-upload-modal"
import PhotoDetailModal from "./photo-detail-modal"

type ReqState = { res: 'ok' | 'err'; id: string; msg: string } | 'loading' | ''
const id = () => randomBytes(4).toString('ascii')

const AlbumMenu = ({
  expanded, setExpanded, selectedAlbum, setSelectedAlbum,
  setModalAction }:
  {
    expanded: boolean;
    setExpanded: Dispatch<SetStateAction<boolean>>;
    selectedAlbum: Album | null;
    setSelectedAlbum: Dispatch<SetStateAction<Album | null>>
    setModalAction: Dispatch<SetStateAction<string>>
  }) => {
  const { journeyId, albumId }: { [k: string]: string } = useParams()
  const [loading, setLoading] = useState(false)
  const [albums, setAlbum] = useState<Album[]>([])
  useEffect(() => {
    setLoading(true)
    axios.get(`/api/v1/albums?journeyId=${journeyId}`)
      .then(({ data }) => setAlbum(data.albums))
      .catch((e) => console.log(e))
      .finally(() => setLoading(false))
  }, [])

  return (!expanded ? <></> :
    < div id="dropdown-menu" className="absolute right-0 bottom-7 space-y-2 w-72 p-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 " >
      <h1 className="p-1 font font-medium">Move to the album: </h1>
      {loading ? <Spinner /> :
        albums.filter(a => a.id !== albumId).map((album) => (
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
            className="w-20 px-2 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => { setModalAction('move') }}
          >
            Move
          </button>
          <button
            type="button"
            id="submit-button"
            className="w-20 px-2 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => { setExpanded(false) }}
          >
            Cancel
          </button>
        </div>
      }
    </div>
  )
}

const PhotoPanel = ({ photos }: { photos: Photo[] }) => {
  const { journeyId, albumId }: { [k: string]: string } = useParams()
  const router = useRouter()
  // select photos
  const [selectedPhotos, setSelectedPhotos] =
    useState<{ [key: string]: Photo | false }>({})
  const selectedPhotoIds: string[] = []
  Object.keys(selectedPhotos).forEach((pId) =>
    selectedPhotos[pId] && selectedPhotoIds.push(pId))
  // select album
  const [expanded, setExpanded] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  // request
  const [modalAction, setModalAction] = useState('')
  const [reqState, setReqState] = useState<ReqState>('')
  const reset = (status?: 'ok' | 'err') => {
    setExpanded(false)
    setModalAction('')
    if (status === 'err')
      return
    setSelectedPhotos({})
    setSelectedAlbum(null)
    if (status === 'ok')
      return router.refresh()
  }

  return (
    <div className="flex flex-wrap gap-2 p-3 pb-10 relative">
      {/* Spinner and Alert */}
      <div className="w-full">
        {!reqState ? <></> :
          reqState === 'loading' ?
            <Spinner /> :
            reqState.res === 'ok' ?
              <Alert color='green' id={reqState.id}>{reqState.msg}</Alert> :
              <Alert color='red' id={reqState.id}>{reqState.msg}</Alert>
        }
      </div>
      {/* Move Modal */}
      {modalAction === 'move' && selectedAlbum &&
        <ConfirmModal
          text={`Moving ${selectedPhotoIds.length} photos to the album "${selectedAlbum?.name}"`}
          loading={reqState === 'loading'}
          handleOk={async () => {
            try {
              setReqState('loading')
              const { data } = await axios.patch(`/api/v1/photos?journeyId=${journeyId}`,
                { albumId: selectedAlbum.id, photoIds: selectedPhotoIds })
              setReqState({
                res: 'ok', id: id(),
                msg: `${data.count} photos has been moved to Album: ${selectedAlbum?.name}.`
              })
              reset('ok')
            } catch (e) {
              const msg = e instanceof Error ? e.message : 'Operation failed, try again later.'
              setReqState({ res: 'err', id: id(), msg })
              reset('err')
            }
          }}
          handleCancel={() => { setModalAction('') }}
        />
      }
      {/* Delete Modal */}
      {modalAction === 'delete' &&
        <ConfirmModal
          text={`Are you sure you want to delete ${selectedPhotoIds.length} photos permanently?`}
          loading={reqState === 'loading'}
          handleOk={async () => {
            try {
              setReqState('loading')
              const query = selectedPhotoIds.map((id) => `ids[]=${id}`).join('&')
              const { data } = await axios.delete(
                `/api/v1/photos?journeyId=${journeyId}&${query}`)
              Object.values(selectedPhotos).forEach(p =>
                p && deleteFromS3(p.url).catch(e => console.log(e)))
              setReqState({ res: 'ok', id: id(), msg: `${data.count} photos has been deleted` })
              reset('ok')
            } catch (e) {
              const msg = e instanceof Error ? e.message : 'Operation failed, try again later.'
              setReqState({ res: 'err', id: id(), msg })
              reset('err')
            }
          }}
          handleCancel={() => { setModalAction('') }}
        />
      }
      {/* Uploading Modal and Add button */}
      <MultipleFileUploadingModal reset={reset} reqState={reqState} setReqState={setReqState} />
      {/* photo detail modal */}
      {modalAction.startsWith('detail') &&
        <PhotoDetailModal setModalAction={setModalAction} photoString={modalAction.slice(6)} />
      }

      {/* Photos */}
      {photos.map((p) =>
        <div key={p.id} className="shadow-md relative">
          <div onClick={() => setModalAction(`detail${JSON.stringify(p)}`)}
            className="cursor-pointer relative w-36 h-36 overflow-hidden">
            <Image
              src={p.url}
              alt={p.description || 'photo'}
              fill
              sizes='8rem'
              className={"object-cover " + (selectedPhotos[p.id] ? 'border-2 border-sky-500' : '')}
            />
          </div>
          { p.editable && 
            <label className="absolute -top-2 -left-2 flex items-center p-3 rounded-full cursor-pointer" htmlFor="check">
            <input type="checkbox"
              className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 hover:before:opacity-10"
              id="check" checked={!!selectedPhotos[p.id]}
              onChange={() => setSelectedPhotos((prev) => {
                return { ...prev, [p.id]: (!prev[p.id] ? p : false) }
              })}
            />
            <span
              className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                stroke="currentColor" strokeWidth="1">
                <path fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"></path>
              </svg>
            </span>
          </label>}
        </div>)}
      {/* Control bar */}
      {!!selectedPhotoIds.length &&
        <div className="fixed bottom-4 left-2/4 -translate-x-2/4 rounded-full bg-white w-80 px-4 py-2 flex justify-between">
          <p className="flex items-center">{`Selected: ${selectedPhotoIds.length}`}</p>
          <div className="flex items-center">
            {/* delete button */}
            <TrashBin className="p-1 text-l cursor-pointer"
              onClick={() => setModalAction('delete')} />
            {/* Move button and album menu */}
            <div className="relative">
              <ArrowRepeat className="p-1 text-l cursor-pointer"
                onClick={() => setExpanded(p => !p)} />
              {expanded &&
                <AlbumMenu
                  expanded={expanded}
                  setExpanded={setExpanded}
                  selectedAlbum={selectedAlbum}
                  setSelectedAlbum={setSelectedAlbum}
                  setModalAction={setModalAction}
                />}
            </div>
            {/* close button */}
            <Close className="p-1 text-m cursor-pointer text-gray-700"
              width='30'
              onClick={() => setSelectedPhotos({})}
            />
          </div>
        </div>}
    </div>
  )
}

export default PhotoPanel
