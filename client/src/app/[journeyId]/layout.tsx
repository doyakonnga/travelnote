import axios, { AxiosError } from "axios"
import { cookies } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"
import CreateConsumptionForm from "@/components/create-consumption-form"
import SelectionBar from "@/components/selection-bar"


const JourneyLayout = async ({ params, children }: {
  params: { journeyId: string },
  children: React.ReactNode
}) => {
  const { journeyId } = params
  const Cookie = cookies().getAll().map((c) => `${c.name}=${c.value};`).join(' ')

  let journey: Journey
  try {
    const { data } = await axios
      .get(`${process.env.NGINX_HOST}/api/v1/journeys/${journeyId}`, {
        headers: {
          Host: "travelnote.com",
          Cookie
        }
      })
    journey = data.journey
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
    <div className="w-full flex items-center justify-center">
      <div className="max-w-4xl w-full p-6">
        <h1 className="text-xl font-semibold mb-6 text-black">
          <a href="/" className="hover:text-blue-500">My journeys</a>
          {` >> ${journey.name}`}
        </h1>
        <CreateConsumptionForm journeyId={journey.id} users={journey.members} />
        <SelectionBar></SelectionBar>
        {children}
      </div>
    </div>
  )
}

export default JourneyLayout
