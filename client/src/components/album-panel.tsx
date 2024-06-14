'use client'

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"

const AlbumPanel = ({ albums }: { albums: Album[] }) => {
  const { journeyId: jId } = useParams<{ journeyId: string }>()
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="flex flex-wrap gap-2">
      {albums.map((a) =>
        <div key={a.id} className="p-2 rounded-xl hover:bg-gray-100">
          <Link className="block space-y-1"
            href={`/journey/${jId}/albums/${a.id}`}>
            <div className="relative w-36 h-36 rounded-xl overflow-hidden shadow-md">
              <Image
                src={a.photos[0] ? a.photos[0].url : '/gray.png'}
                alt={'album cover of ' + a.name}
                fill
                className="object-cover"
              />
            </div>
            <h1 className="font-medium">{a.name}</h1>
            <p className="text-sm text-neutral-800">{a.photos ? a.photos.length : 0}</p>
          </Link>
        </div>)}
    </div>
  )
}

export default AlbumPanel
