import axios from "axios"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

type Consumption = {
  id: string
  isForeign: boolean
  expenses: {
    id: string
    userId: string
    amount: number
    isPaid: boolean
  }[]
}

const ConsumptionCard = ({ consumption, members }: {
  consumption: Consumption
  members: Member[]
}) => {
  return (
    <div className="flex flex-wrap">
      {consumption.expenses.map((ex) => {
        const u = members.find((m) => m.id === ex.userId)
        return (
          <div className={"w-8/12 flex rounded-md ml-auto mr-2 p-1 space-x-1 " + (ex.isPaid ? 'bg-teal-400' : 'bg-rose-400')}>
            <div className="shrink-0 w-3/12 ml-auto space-x-1">
              <img className="inline flex-shrink-0 object-cover mx-1 rounded-full w-7 h-7" src={u?.avatar || '/user.png'} alt="user avatar" />
              <span>{(u?.name || "user")}</span>
            </div>
            <div className="shrink-0 w-2/12 text-end pr-2">{ex.amount}</div>
          </div>
        )
      })}
    </div>
  )
}

const ConsumptionPage = async ({ params }: {
  params: { journeyId: string }
}) => {

  const Cookie = cookies().getAll().map((c) => `${c.name}=${c.value};`).join(' ')
  let consumptions: Consumption[] = []
  let journey: { members: Member[] }
  let jId = params.journeyId

  try {
    const [{ data }, { data: data2 }] = await Promise.all([
      axios.get(`${process.env.NGINX_HOST}/api/v1/consumption/?journeyId=${jId}`, {
        headers: { Host: "travelnote.com", Cookie }
      }),
      axios.get(`${process.env.NGINX_HOST}/api/v1/journey/${jId}`, {
        headers: { Host: "travelnote.com", Cookie }
      }).catch(() => { return { data: { journey: { members: [] } } } })
    ]
    )
    consumptions = data.consumptions
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

  return (
    <div className='space-y-2 bg-slate-600 border-slate-700 rounded-md px-6 py-4'>
      {consumptions.map((c) =>
        <ConsumptionCard key={c.id} consumption={c} members={journey.members} />
      )}
    </div>
  )
}

export default ConsumptionPage
