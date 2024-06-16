'use client'

import Image from "next/image"

const PhotoPanel = ({ photos }: { photos: Photo[] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {photos.map((p) =>
        <div key={p.id}
          className="relative w-36 h-36 rounded-xl overflow-hidden shadow-md">
          <Image
            src={p.url}
            alt={p.description || 'photo'}
            fill
            className="object-cover"
          />
        </div>)}
    </div>
  )
}

export default PhotoPanel
