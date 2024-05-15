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

const ConsumptionCard = ({ consumption }: { consumption: Consumption }) => {
  return (
    <div>
      {consumption.expenses.map((ex) => (
        <div className={ex.isPaid ? 'bg-teal-400' : 'bg-rose-400'}>
          <h1>{ex.userId}</h1>
          <span>{ex.amount}</span>
        </div>
      ))}
    </div>
  )
}

const ConsumptionPage = async ({ params }: {
  params: { journeyId: string }
}) => {

  const Cookie = cookies().getAll().map((c) => `${c.name}=${c.value};`).join(' ')
  let consumptions: Consumption[] = []

  try {
    const { data } = await axios
      .get(`${process.env.NGINX_HOST}/api/v1/consumption/?journeyId=${params.journeyId}`, {
        headers: {
          Host: "travelnote.com",
          Cookie
        }
      })
    consumptions = data.consumptions
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
    <div>
      {consumptions.map((c) =>
        <ConsumptionCard key={c.id} consumption={c} />
      )}
    </div>
  )
}

export default ConsumptionPage
