'use client'

import Image from "next/image"
import { useState } from "react"
import { DiVim } from "react-icons/di"
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa"

const Carousel = ({ photos }: { photos: Photo[] }) => {
  const l = photos.length
  const [current, setCurrent] = useState(0)


  return (
    <div className="overflow-hidden relative">
      <div className="flex items-center shrink-0 min-h-96 transition duration-400"
        style={{ transform: `translateX(${current * -100}%)` }}
      >
        {photos.map((p) =>
          <img
            key={'img' + p.id} src={p.url}
            alt={p.description || 'user uploaded picture'}
          ></img>)}
      </div>
      <div className="absolute inset-0 p-5 flex justify-between items-center text-white text-3xl">
        <button type='button'
          onClick={() => { 
            setCurrent((prev) => (prev - 1 + l) % l) 
            console.log(current)
          }}
        >
          <FaArrowCircleLeft />
        </button>
        <button type='button'
          onClick={() => { 
            setCurrent((prev) => (prev + 1) % l)
            console.log(current)
          }}
        >
          <FaArrowCircleRight />
        </button>
      </div>
      <div className="absolute bottom-0 py-4 w-full flex justify-center gap-5">
        {photos.map((p, i) => <div
          key={'dot' + p.id}
          className={"rounded-full w-5 h-5 " + (i === current? "bg-white": "bg-gray-400") }
          onClick={() => setCurrent(i)}
        ></div>)}
      </div>
    </div>
  )
}

export default Carousel
