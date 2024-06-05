'use client'

import { ChangeEvent, useEffect, useState } from "react"
import { Add } from "@/components/svg"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"


const AlbumSelector = () => {
  const params = useParams()
  const [expanded, setExpanded] = useState(false)
  const [albums, setAlbums] = useState<{
    id: string; name: string
  }[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<{
    id: string; name: string
  } | null>(null)
  useEffect(() => {
    const jId = params.journeyId as string
    axios.get(`/api/v1/album?journeyId=${jId}`)
      .then(({ data }) => { setAlbums(data.albums) })
  }, [])
  return (
    <div className="relative inline-block text-left">
      <button
        id="dropdown-button"
        className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
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
        id="dropdown-menu"
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
  consumption: Consumption & { photos: Photo[] }
}) => {
  const [expanded, setExpanded] = useState(false)
  const [objectUrl, setObjectUrl] = useState('')

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setObjectUrl(URL.createObjectURL(file))
    } else {
      return setObjectUrl('')
    }
  }
  const handleFileCancel = () => {
    if (objectUrl)
      URL.revokeObjectURL(objectUrl)
    setObjectUrl('')
  }

  return (
    <div className="w-full mt-2">
      <h2 id="accordion-color-heading-1">
        <button
          type="button"
          className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 dark:border-gray-700 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-gray-800 gap-3"
          onClick={() => setExpanded((p) => !p)}
        // data-accordion-target="#accordion-color-body-1"
        // aria-expanded="true"
        // aria-controls="accordion-color-body-1"
        >
          <span>{`Photo: ${consumption.photos.length}`}</span>
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
      <div
        id="accordion-color-body-1"
        className={(!expanded ? "hidden " : " ") + "relative"}
      // aria-labelledby="accordion-color-heading-1"
      >
        {!objectUrl &&
          <div>
            <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900">
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                Flowbite is an open-source library of interactive components built on
                top of Tailwind CSS including buttons, dropdowns, modals, navbars, and
                more.
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                Check out this guide to learn how to{" "}
                <a
                  href="/docs/getting-started/introduction/"
                  className="text-blue-600 dark:text-blue-500 hover:underline"
                >
                  get started
                </a>{" "}
                and start developing websites even faster with components on top of
                Tailwind CSS.
              </p>
            </div>
            <label className="absolute bottom-3 right-3 cursor-pointer">
              <Add props={{}} />
              <input type="file" className="hidden" name="picture"
                onChange={handleFileInputChange}
              />
            </label>
          </div>}

        {objectUrl && (
          <div className='flex relative'>
            <Image
              src={objectUrl}
              alt='selected image'
              width={500}
              height={500}
            />
            <button type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 absolute right-0 top-0"
              onClick={handleFileCancel}
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <AlbumSelector />
          </div>
        )

        }
      </div>
    </div>
  )
}

export default ConsumptionPhotoAccordion
