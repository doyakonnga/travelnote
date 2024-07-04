import UserInfo from "@/components/user-info"
import axios from "axios"
import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"


const UserPage = async () => {
  const Cookie = cookies().getAll().map((c) => `${c.name}=${c.value};`).join(' ')
  let user: Member
  try {
    const { data } = await axios
      .get(`${process.env.NGINX_HOST}/api/v1/user/currentuser`, {
        headers: {
          Host: "travelnote.com",
          Cookie
        }
      })
    user = data.user
  } catch (e) {
    if (axios.isAxiosError(e) &&
      e.response &&
      e.response.status === 404) {
      return notFound()
    }
    console.log(e)
    return <h1>Server error</h1>
  }
  if (!user) return redirect('/login')

  return (
    <UserInfo user={user}/>
  )
}

export default UserPage
