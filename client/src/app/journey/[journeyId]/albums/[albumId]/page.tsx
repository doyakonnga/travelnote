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
    const { data } = await axios
      .get(`${process.env.NGINX_HOST}/api/v1/album/${aId}?journeyId=${jId}`,
        { headers: {
            Host: "travelnote.com",
            Cookie
          }
        })
    album = data.album
  } catch (e) {
    console.log(e)
  }
  if (!album) return notFound()

  return (
    <div>
      <Link href={`/journey/${jId}/albums`}>{'Albums>>'}</Link>
      <Link href="#">{album.name}</Link>
      <PhotoPanel photos={album.photos}/>
    </div>
  )
}

export default AlbumPage
