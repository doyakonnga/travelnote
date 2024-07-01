import Charts from "@/components/chart"
import axios from "axios"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

const data = [
  { name: 'Chang', amount: 2000 },
  { name: 'Shogeko', amount: -1000 },
  { name: 'Sakutan', amount: -1000 }
]
interface Balances {
  domestic: { [key: string]: number },
  foreign: { [key: string]: number }
}
interface BalanceArrays {
  domestic: { name: string, amount: number }[],
  foreign: { name: string, amount: number }[]
}

const BalancesPage = async ({ params }: { params: { journeyId: string } }) => {
  const Cookie = cookies().getAll().map((c) => `${c.name}=${c.value};`).join(' ')
  let jId = params.journeyId
  let balances: Balances = { domestic: {}, foreign: {} }
  let defaultRate = 0
  let balanceArrays: BalanceArrays = { domestic: [], foreign: [] }

  try {
    const [{ data }, { data: data2 }] = await Promise.all([
      axios.get(`${process.env.NGINX_HOST}/api/v1/balances/?journeyId=${jId}`, {
        headers: { Host: "travelnote.com", Cookie }
      }),
      axios.get(`${process.env.NGINX_HOST}/api/v1/journey/${jId}`, {
        headers: { Host: "travelnote.com", Cookie }
      }).catch((e) => {
        console.log(e)
        return { data: { journey: { members: [] } } }
      })
    ])
    balances = data.balances
    defaultRate = data.defaultRate
    const { members }: { members: Member[] } = data2.journey
    for (const currency of ['domestic', 'foreign'] as const){
      members.forEach(({ id, name }) => {
        const amount = balances[currency][id] || 0
        balanceArrays[currency].push({ name, amount })
      })
    }
    console.log(balanceArrays)
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
    <div className="w-full">
      <Charts balanceArrays={balanceArrays} defaultRate={defaultRate}/>
    </div>
  )
}

export default BalancesPage
