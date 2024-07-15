import JourneyCard from '@/components/journey-card-edit'
import { Renew } from '@/components/client-action'
import axios from 'axios'
import { cookies } from 'next/headers'
import Alert from '@/components/alert';

export default async function EditPage({ searchParams }: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {

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
      id={j.id}
      name={j.name}
      subtitle={j.subtitle}
      picture={j.picture}
    />)
  } catch (e) { console.log(e) }
  // console.log(data)

  return (
    <main className="relative flex flex-wrap min-h-screen flex-col items-center justify-between p-24">

      <Renew />

      {searchParams &&
        typeof searchParams.msg === 'string' &&
        typeof searchParams.id === 'string' &&
        <div className='z-30'>
          <Alert color='green' id={searchParams.id}>{searchParams.msg}</Alert>
        </div>
      }
      <div className="absolute bg-black opacity-60 inset-0 z-0" />
      {list}
    </main>
  )
}
