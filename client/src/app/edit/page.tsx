import JourneyCard from '@/components/journey-card-edit'
import { Renew } from '@/components/client-action'
import axios from 'axios'
import { cookies } from 'next/headers'

export default async function EditPage() {

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
      journeyId={j.id}
      title={j.name}
      subtitle={j.subtitle}
      picture={j.picture}
    />)
  } catch (e) { console.log(e) }
  // console.log(data)

  return (
    <main className="relative flex flex-wrap min-h-screen flex-col items-center justify-between p-24">

      <Renew />
      <div className="absolute bg-black opacity-60 inset-0 z-0" />
      Content
      {list}
    </main>
  )
}
