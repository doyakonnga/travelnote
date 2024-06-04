import ConsumptionCard from "@/components/consumption-card"
import axios from "axios"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { UrlAlert } from '@/components/alert'



const ConsumptionPage = async ({ params }: {
  params: { journeyId: string }
}) => {

  const Cookie = cookies().getAll().map((c) => `${c.name}=${c.value};`).join(' ')
  let consumptions: (Consumption & {photos: Photo[]})[] = []
  let journey: { members: Member[] }
  let photos: Photo[] = []
  let jId = params.journeyId

  try {
    const [{ data }, { data: data2 }, { data: data3 }] = await Promise.all([
      axios.get(`${process.env.NGINX_HOST}/api/v1/consumption/?journeyId=${jId}`, {
        headers: { Host: "travelnote.com", Cookie }
      }),
      axios.get(`${process.env.NGINX_HOST}/api/v1/journey/${jId}`, {
        headers: { Host: "travelnote.com", Cookie }
      }).catch((e) => { 
        console.log(e)
        return { data: { journey: { members: [] } } } 
      }),
      axios.get(`${process.env.NGINX_HOST}/api/v1/photo/?journeyId=${jId}`, {
        headers: { Host: "travelnote.com", Cookie }
      }).catch((e) => {
        console.log(e)
        return { data: { photos: [] } } 
      })
    ])
    consumptions = (data.consumptions)
    consumptions.forEach((c) => { c.photos = [] })
    journey = data2.journey
    photos = data3.photos
    // append photos onto consumptions
    photos.forEach((p) => {
      if(p.consumptionId)
        consumptions.find((c) => c.id === p.consumptionId)?.photos.push(p)
    })
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      if (e.response.status === 404)
        return notFound()
      if (e.response.status === 401)
        return (
          <h1>
            Need being added in the journey to view this page
          </h1>)
    }
    console.log(e)
    return <h1>Server error</h1>
  }
  // insert dates
  let date = ''
  let consumpsAndDates: (Consumption | string)[] = []
  consumptions.forEach((c) => {
    if (c.createdAt !== date)
      consumpsAndDates.push(date = c.createdAt.slice(0, 10))
    consumpsAndDates.push(c)
  })
  return (
    <div className='mt-4'>
      <UrlAlert/>
      {consumpsAndDates.map((c) => {
        if (typeof c === 'string') return <h1 key={c} className="m-2">{c}</h1>
        return (
          <ConsumptionCard key={c.id} consumption={c} members={journey.members} />
        )
      })}
    </div>
  )
}

export default ConsumptionPage
