'use client'

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa"
import { BiPhotoAlbum } from "react-icons/bi";

const Carousel = ({ photos }: { photos: PhotoJoinedAlbum[] }) => {
  const l = photos.length
  const jId = useParams().journeyId
  const [current, setCurrent] = useState(0)

  return (
    <div>
      <div className="overflow-hidden relative">
        <div className="flex shrink-0 transition duration-400"
          style={{ transform: `translateX(${current * -100}%)` }}
        >
          {photos.map((p) =>
            <div key={'img' + p.id}  className="relative min-h-[32rem] min-w-full">
              <Image
                src={p.url}
                alt={p.description || 'user uploaded picture'}
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>)}
        </div>
        {/* left and right buttons */}
        <div className="absolute left-5 inset-y-0 flex justify-between items-center text-white text-3xl">
          <button type='button'
            onClick={() => {
              setCurrent((prev) => (prev - 1 + l) % l)
            }}
          >
            <FaArrowCircleLeft />
          </button>
        </div>
        <div className="absolute right-5 inset-y-0 flex justify-between items-center text-white text-3xl">
          <button type='button'
            onClick={() => {
              setCurrent((prev) => (prev + 1) % l)
            }}
          >
            <FaArrowCircleRight />
          </button>
        </div>
        {/* dots */}
        <div className="absolute bottom-4 w-full flex justify-center gap-4">
          {photos.map((p, i) => <div
            key={'dot' + p.id}
            className={"rounded-full w-4 h-4 cursor-pointer " + (i === current ? "bg-white" : "bg-gray-400")}
            onClick={() => setCurrent(i)}
          ></div>)}
        </div>
      </div>
      {photos[current] &&
        <div className="flex-col items-center gap-2 m-4">
          <div className="flex items-center justify-center">
            <Link className="flex items-center gap-1 text-sky-300"
              href={`/journey/${jId}/albums/${photos[current].albumId}`}>
              <BiPhotoAlbum />
              <p>{photos[current].album.name}</p>
            </Link>
          </div>
          <p className="px-8 mx-8 text-gray-100"> {photos[current].description} </p>
        </div>
      }
    </div>
  )
}

export default Carousel
