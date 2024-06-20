'use client'

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import { Add } from "@/components/svg"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import Spinner from "./spinner"
import Alert from "./alert"
import { randomBytes } from "crypto"
import { Sha256 } from "@aws-crypto/sha256-browser"
import { getUploadUrl } from "./actions"
import Carousel from "./carousel"
import Link from "next/link"

interface Album {
  id: string; name: string
}

const AlbumSelector = ({ selectedAlbum, setSelectedAlbum }: {
  selectedAlbum: Album | null
  setSelectedAlbum: Dispatch<SetStateAction<Album | null>>
}) => {
  const [expanded, setExpanded] = useState(false)
  const albumMenu = useRef<HTMLDivElement>(null)
  const togglebutton = useRef<HTMLButtonElement>(null)
  const [albums, setAlbums] = useState<Album[]>([])
  const params = useParams()
  useEffect(() => {
    const jId = params.journeyId as string
    axios.get(`/api/v1/albums?journeyId=${jId}`)
      .then(({ data }) => { setAlbums(data.albums) })
    const handleClickOurside = (e: MouseEvent) => {
      if (albumMenu.current && togglebutton.current
        && !e.composedPath().includes(albumMenu.current)
        && !e.composedPath().includes(togglebutton.current)
      )
        setExpanded(false)
    }
    document.addEventListener("click", handleClickOurside)
    return () => {
      document.removeEventListener("click", handleClickOurside)
    }
  }, [])
  return (
    <div className="relative inline-block text-left">
      <button
        id="dropdown-button"
        type="button"
        className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
        ref={togglebutton}
        onClick={() => setExpanded((p) => !p)}
      >
        {selectedAlbum?.name || "Select Item"}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 ml-2 -mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        id="dropdown-menu" ref={albumMenu}
        className={"origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 "
          + (!expanded ? 'hidden' : '')}
      >
        <div
          className="py-2 p-2"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="dropdown-button"
        >
          {albums.map((album) => (
            <p
              key={album.id}
              className="block px-4 py-2 mb-1 text-sm text-gray-700 rounded-md bg-white hover:bg-gray-100"
              role="menuitem"
              onClick={() => {
                setSelectedAlbum(album)
                setExpanded(false)
              }}
            >
              {album.name}
            </p>))}

          {/* Input field and submit button inside the dropdown */}
          <input
            type="text"
            id="input-field"
            className="w-full px-4 py-2 border rounded-md mb-2 focus:outline-none focus:border-blue-500"
            placeholder="Enter New Item"
          />
          <button
            type="button"
            id="submit-button"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )
}


const ConsumptionPhotoAccordion = ({ consumption }: {
  consumption: Consumption
}) => {
  const [expanded, setExpanded] = useState(false)
  const [reqState, setReqState] = useState<{
    result: 'ok' | 'error'
    id: string
    msg: string
  } | 'loading' | ''>('')
  const [photos, setPhotos] = useState<PhotoJoinedAlbum[]>([])
  const [object, setObject] = useState<[File | null, string]>([null, ''])
  const [description, setDescription] = useState('')
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  useEffect(() => {
    setReqState('loading')
    axios.get(`/api/v1/photos/?consumptionId=${consumption.id}`)
      .then(({ data }) => {
        setPhotos(data.photos)
        setReqState('')
      })
      .catch((e) => {
        console.log(e)
        setReqState({
          result: 'error',
          id: randomBytes(4).toString(),
          msg: 'photo fetching failed'
        })
      })
  }, [])

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) { return setObject([null, '']) }
    return setObject([file, URL.createObjectURL(file)])
  }
  const handleFileCancel = () => {
    if (object[1])
      URL.revokeObjectURL(object[1])
    setObject([null, ''])
  }
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      if (!selectedAlbum)
        throw new Error('Please select an album.')
      if (!object[0])
        throw new Error('Please select a photos.')
      setReqState('loading')
      const { type, size } = object[0]
      // photo to s3
      const hash = new Sha256();
      hash.update(await object[0].arrayBuffer());
      const buf = await hash.digest()
      const checkSum = Array.from(new Uint8Array(buf)).
        map((b) => b.toString(16).padStart(2, '0')).join('')
      const s3url = await getUploadUrl(type, size, checkSum)
      if (typeof s3url !== 'string') throw Error(s3url.error)
      await axios.put(s3url, object[0],
        { headers: { "Content-Type": object[0].type } })
      console.log(s3url.split('?')[0])
      // photo data to backend
      const { data } = await axios.post('/api/v1/photos', {
        url: s3url.split('?')[0],
        description,
        albumId: selectedAlbum.id,
        consumptionId: consumption.id
      })
      setPhotos((prev) => [data.photo, ...prev])
      setReqState({
        result: 'ok',
        id: randomBytes(4).toString(),
        msg: 'The photo was successfully uploaded.'
      })
      setObject([null, ''])
    } catch (e) {
      setReqState({
        result: 'error',
        id: randomBytes(4).toString(),
        msg: (e instanceof Error) ? e.message : 'Error'
      })
      console.log(e)
    }
  }

  return (
    <div className="w-full mt-2">
      <h2 id="accordion-color-heading-1">
        <button
          type="button"
          className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 dark:border-gray-700 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-gray-800 gap-3"
          onClick={() => setExpanded((p) => !p)}
        >
          <span>{`Photo: ${photos.length}`}</span>
          <svg
            data-accordion-icon=""
            className="w-3 h-3 rotate-180 shrink-0"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5 5 1 1 5"
            />
          </svg>
        </button>
      </h2>
      {/* expanded body */}
      <div
        id="accordion-color-body-1"
        className={(!expanded ? "hidden " : " ") + "relative"}
      >
        {(reqState === 'loading') &&
          <Spinner />
        }
        {!object[0] && (reqState !== 'loading') &&
          <div className="relative">
            <Carousel photos={photos} />
            <label className="absolute bottom-3 right-3 cursor-pointer">
              <Add props={{}} />
              <input type="file" className="hidden" name="picture"
                onChange={handleFileInputChange}
              />
            </label>
          </div>}

        {object[1] && (reqState !== 'loading') && (
          <div className='flex flex-wrap justify-between relative'>
            <Image
              src={object[1]}
              alt='selected image'
              width={500}
              height={500}
            />
            {/* absolute close button */}
            <button type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 absolute right-0 top-0"
              onClick={handleFileCancel}
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <form className="flex-col justify-end items-end space-2">
              <AlbumSelector
                selectedAlbum={selectedAlbum}
                setSelectedAlbum={setSelectedAlbum}
              />
              <textarea name="description" id="description"
                value={description}
                onChange={(e) => { setDescription(e.target.value) }}
              />
              <button
                type="submit"
                className="my-5 w-full flex justify-center bg-gray-700 text-white p-2 rounded-md tracking-wide hover:bg-black focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors duration-100"
                onClick={handleSubmit}
              >
                Post
              </button>
            </form>
          </div>)
        }
      </div>
      {(typeof reqState !== 'string') &&
        <Alert color={reqState.result === 'ok' ? "green" : "red"}
          id={reqState.id}>
          {reqState.msg}
        </Alert>
      }
    </div>
  )
}

export default ConsumptionPhotoAccordion
