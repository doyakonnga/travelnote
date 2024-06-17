'use client'

import Image from "next/image"
import { useEffect, useState } from "react"
import { ArrowRepeat, Close } from "./svg"
import axios from "axios"
import { useParams } from "next/navigation"
import Spinner from "./spinner"


const AlbumMenu = () => {
  const [albums, setAlbum] = useState<Album[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [loading, setLoading] = useState(false)
  const { journeyId: jId }: { journeyId: string } = useParams()
  useEffect(() => {
    setLoading(true)
    axios.get(`/api/v1/albums?journeyId=${jId}`)
      .then(({ data }) => setAlbum(data.albums))
      .catch((e) => console.log(e))
      .finally(() => setLoading(false))
  }, [])

  return (
    < div id="dropdown-menu" className="absolute right-0 bottom-7 space-y-2 w-72 p-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 " >
      <h1 className="p-1 font font-medium">Select an album: </h1>
      {loading ? <Spinner /> :
        albums.filter(a => a.name !== 'unclassified').map((album) => (
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
      {
        selectedAlbum &&
        <div className="flex justify-between py-1">
          <button
            type="button"
            id="submit-button"
            className="w-20 px-2 py-1 bg-rose-400 text-black rounded-md hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => { }}
          >
            Delete
          </button>
          <button
            type="button"
            id="submit-button"
            className="w-20 px-2 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => { }}
          >
            Rename
          </button>
          <button
            type="button"
            id="submit-button"
            className="w-20 px-2 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => { }}
          >
            Cancel
          </button>
        </div>
      }
    </div>
  )
}

const PhotoPanel = ({ photos }: { photos: Photo[] }) => {
  const [selectedPhotos, setSelectedPhotos] =
    useState<{ [key: string]: {} }>({})
  const [expanded, setExpanded] = useState(false)
  const selectionArray: string[] = []
  Object.keys(selectedPhotos).forEach((pId) =>
    selectedPhotos[pId] && selectionArray.push(pId))

  return (
    <div className="flex flex-wrap gap-2 p-3 pb-10">
      {photos.map((p) =>
        <div key={p.id}
          className="relative w-36 h-36 overflow-hidden shadow-md">
          <Image
            src={p.url}
            alt={p.description || 'photo'}
            fill
            className={"object-cover " + (selectedPhotos[p.id] ? 'border-2 border-sky-500' : '')}
          />
          <label className="absolute -top-2 -left-2 flex items-center p-3 rounded-full cursor-pointer" htmlFor="check">
            <input type="checkbox"
              className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500 hover:before:opacity-10"
              id="check" checked={!!selectedPhotos[p.id]}
              onChange={() => setSelectedPhotos((prev) => {
                return { ...prev, [p.id]: !prev[p.id] }
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
          </label>
        </div>)}

      {!!selectionArray.length &&
        <div className="fixed bottom-4 left-2/4 -translate-x-2/4 rounded-full bg-white w-80 px-4 py-2 flex justify-between">
          <p className="flex items-center">{`Selected: ${selectionArray.length}`}</p>
          <div className="flex">
            <div>
              <ArrowRepeat className="p-1 text-l cursor-pointer"
                onClick={() => setExpanded(p => !p)} />
              {expanded && <AlbumMenu />}
            </div>
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
