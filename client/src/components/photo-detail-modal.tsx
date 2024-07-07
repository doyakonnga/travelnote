'use client'

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Close, RectangleList } from "./svg"
import axios from "axios"
import Image from "next/image"
import { useParams } from "next/navigation"
import Spinner from "./spinner"
import Link from "next/link"

const PhotoDetailModal = ({ setModalAction, photoString }: {
  setModalAction: Dispatch<SetStateAction<string>>
  photoString: string
}) => {
  const { journeyId }: { journeyId: string } = useParams()
  const photo: Photo = JSON.parse(photoString)
  const [user, setUser] = useState<Member | null>(null)
  const [consumption, setConsumption] = useState<Consumption | null>(null)
  useEffect(() => {
    axios.get(`/api/v1/user/${photo.userId}`)
      .then(({ data }) => setUser(data.user)).catch(e => console.log(e))
    if (photo.consumptionId)
      axios.get(`/api/v1/consumptions/${photo.consumptionId}?journeyId=${journeyId}`)
        .then(({ data }) => setConsumption(data.consumption))
        .catch(e => console.log(e))
  }, [])


  return (
    <div className="fixed inset-0 m-0 z-20 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="z-30 bg-white p-4 gap-3 rounded flex justify-center items-center min-w-80 max-w-xl relative">
        <Image src={photo.url} width='320' height='320' alt='photo' />
        <div className="flex flex-col justify-center gap-2">
          {user ? (
            <div>
              <h1>
                <img className="flex-shrink-0 object-cover mx-1 rounded-full w-9 h-9 inline"
                  src={user?.avatar || '/user.png'} alt="user avatar" />
                {user?.name}
              </h1>
              <h1>{photo.description}</h1>
            </div>) : <Spinner />}
          {consumption ? (
            <Link href={`/journey/${journeyId}/consumptions#${consumption.id}`}>
              <h1>
                <RectangleList className="inline" />
                {consumption.isForeign}
                {consumption.expenses.reduce((pre, cur) => pre + cur.amount, 0)}
              </h1>
              <p>{consumption.name}</p>
            </Link>) :
            <h1>No binding consumption</h1>}
        </div>
        <Close className="absolute top-2 right-2 cursor-pointer"
          onClick={() => setModalAction('')} />
      </div>
    </div>
  )
}

export default PhotoDetailModal
