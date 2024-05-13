
'use client'
import Image from "next/image"
import Link from "next/link"

interface Props {
  journeyId: string
  title: string
  subtitle: string | null
  picture: string | null
}
interface User {
  name: string
  email: string
  avatar: string
}
const JourneyCard = (props: Props) => {
  const { journeyId, title, subtitle, picture } = props
  return (
    <Link href={'/journey/' + journeyId} className="w-full">
      <div className="w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 p-4 mx-auto">
        <div className="bg-white p-6 rounded-lg flex flex-wrap">
          <Image className="h-72  rounded w-full object-cover object-center mb-6" src={picture || 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} alt="journey picture" width={720} height={400} />
          <h1 className="text-lg text-gray-900 font-medium title-font mb-4 inline-block">{title}</h1>
          <p className="leading-relaxed text-base">{subtitle}</p>
        </div>
      </div>
    </Link>
  )
}

export default JourneyCard
