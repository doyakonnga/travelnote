import JourneyCard from '@/components/journey-card'
import Renew from '@/components/renew'
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
    const { data }: { data: Journeys } = await axios.get(process.env.NGINX_HOST + '/api/v1/journey', {
      headers: {
        Host: "travelnote.com",
        Cookie
      }
    })
    list = data.map((j) => <JourneyCard
      key={j.id}
      title={j.name}
      subtitle={j.subtitle}
      picture={j.picture}
      edit={true}
    />)
  } catch (e) { console.log(e) }
  // console.log(data)

  return (
    <main className="flex flex-wrap min-h-screen flex-col items-center justify-between p-24">
      <Renew />
      Content
      {list}
    </main>
  )
}
