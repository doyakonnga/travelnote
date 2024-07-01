import ConsumptionCard from "@/components/consumption-card"
import axios from "axios"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { UrlAlert } from '@/components/alert'



const ConsumptionPage = async ({ params }: {
  params: { journeyId: string }
}) => {

  const Cookie = cookies().getAll().map((c) => `${c.name}=${c.value};`).join(' ')
  const jId = params.journeyId
  let consumptions: Consumption[] = []
  let journey: { members: Member[] }
  let photos: Photo[] = []

  try {
    const [{ data }, { data: data2 }] = await Promise.all([
      axios.get(`${process.env.NGINX_HOST}/api/v1/consumptions/?journeyId=${jId}`, {
        headers: { Host: "travelnote.com", Cookie }
      }),
      axios.get(`${process.env.NGINX_HOST}/api/v1/journey/${jId}`, {
        headers: { Host: "travelnote.com", Cookie }
      }).catch((e) => {
        console.log(e)
        return { data: { journey: { members: [] } } }
      })
    ])
    consumptions = (data.consumptions)
    journey = data2.journey
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
      <UrlAlert />
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
