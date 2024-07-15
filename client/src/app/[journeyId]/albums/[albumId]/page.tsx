import PhotoPanel from "@/components/photo-panel";
import axios from "axios"
import { cookies } from "next/headers"
import Link from "next/link";
import { notFound } from "next/navigation";

const AlbumPage = async ({ params }: {
  params: { journeyId: string; albumId: string }
}) => {
  const { journeyId: jId, albumId: aId } = params
  const Cookie = cookies().getAll().map((c) => `${c.name}=${c.value};`).join(' ')
  let album: Album | null = null
  let photos: Photo[] = []
  try {
    const [{ data }, { data: data2 }] = await Promise.all([
      axios.get(
        `${process.env.NGINX_HOST}/api/v1/albums/${aId}?journeyId=${jId}&albumId=`,
        { headers: { Host: "travelnote.com", Cookie } }),
      axios.get(
        `${process.env.NGINX_HOST}/api/v1/photos/?journeyId=${jId}&albumId=${aId}`,
        { headers: { Host: "travelnote.com", Cookie } }),
    ])
    album = data.album
    photos = data2.photos
  } catch (e) {
    console.log(e)
  }
  if (!album) return notFound()

  return (
    <div>
      <div className="py-1 my-2">
        <Link href={`/${jId}/albums`} className="hover:text-blue-500">{'Albums'}</Link>
        <span>{' >> '}</span>
        <Link href="#" className="hover:text-blue-500">{album.name}</Link>
      </div>
      <PhotoPanel photos={photos} />
    </div>
  )
}

export default AlbumPage
