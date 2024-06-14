import axios from "axios"
import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { RiFolderAddLine } from "react-icons/ri";
import { AddingAlbumModal, EditingAlbumModal } from "@/components/input-modal"


const AlbumsPage = async ({ params }: { params: { journeyId: string } }) => {

  const jId = params.journeyId
  const Cookie = cookies().getAll().map((c) => `${c.name}=${c.value};`).join(' ')
  let albums: Album[] = []
  try {
    const { data } = await axios
      .get(`${process.env.NGINX_HOST}/api/v1/albums?journeyId=${jId}`, {
        headers: {
          Host: "travelnote.com",
          Cookie
        }
      })
    albums = data.albums
  } catch (e) {
    console.log(e)
  }

  return (
    <div className="relative">
      <EditingAlbumModal albums={albums} />
      <AddingAlbumModal />
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
    </div>
  )
}

export default AlbumsPage
