import { Renew } from '@/components/client-action'
import JourneyCard from '@/components/journey-card-display'
import axios from 'axios'
import { cookies } from 'next/headers'

export default async function Home() {

  const Cookie = cookies().getAll().map((c) => {
    return `${c.name}=${c.value};`
  }).join(' ')

  type Journeys = {
    id: string
    name: string
    subtitle: string | null
    picture: string | null
  }[]

  let list: React.JSX.Element[] = []
  try {
    const { data } = await axios.get(process.env.NGINX_HOST + '/api/v1/journeys', {
      headers: {
        Host: "travelnote.com",
        Cookie
      }
    })
    const journeys: Journeys = data.journeys
    list = journeys.map((j) => <JourneyCard
      key={j.id}
      journeyId={j.id}
      title={j.name}
      subtitle={j.subtitle}
      picture={j.picture}
    />)
  } catch (e) { console.log(e) }
  

  return (
    <main className="flex flex-wrap min-h-screen flex-col items-center justify-between p-24">
      <Renew />
      {list}
    </main>
  )
}
