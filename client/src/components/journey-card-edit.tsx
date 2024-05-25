'use client'

import Image from "next/image"
import { useState } from "react"

interface Props {
  key: string
  title: string
  subtitle: string | null
  picture: string | null
  edit?: true
}
interface User {
  name: string
  email: string
  avatar: string
}
const JourneyCard = (props: Props) => {
  const { key, title, subtitle, picture } = props
  const edit = props.edit || false
  const [option, setOption] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [foundUser, setFoundUser] = useState<User | null>(null)
  const changeOption = (n: number) => {
    if (option === n) return setOption(0)
    return setOption(n)
  }

  return (
    <div key={key} className="w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 p-4 mx-auto z-10">
      <div className="bg-white p-6 rounded-lg flex flex-wrap">
        <Image className="h-72  rounded w-full object-cover object-center mb-6" src={picture || 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'} alt="journey picture" width={720} height={400} />
        <h1 className="text-lg text-gray-900 font-medium title-font mb-4 inline-block">{title}</h1>
        <div className={"inline-block ml-auto" + (edit ? '' : ' hidden')}>
          <svg
            fill="#000000"
            height="18px"
            width="18px"
            version="1.1"
            id="1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 328 328"
            xmlSpace="preserve"
            className="inline-block m-2 rounded-md hover:bg-gray-200 cursor-pointer"
            onClick={() => { changeOption(1) }}
          >
            <g id="XMLID_455_">
              <path
                id="XMLID_458_"
                d="M15,286.75h125.596c19.246,24.348,49.031,40,82.404,40c57.897,0,105-47.103,105-105s-47.103-105-105-105
		c-34.488,0-65.145,16.716-84.298,42.47c-7.763-1.628-15.694-2.47-23.702-2.47c-63.411,0-115,51.589-115,115
		C0,280.034,6.716,286.75,15,286.75z M223,146.75c41.355,0,75,33.645,75,75s-33.645,75-75,75s-75-33.645-75-75
		S181.645,146.75,223,146.75z"
              />
              <path
                id="XMLID_461_"
                d="M115,1.25c-34.602,0-62.751,28.15-62.751,62.751S80.398,126.75,115,126.75
		c34.601,0,62.75-28.148,62.75-62.749S149.601,1.25,115,1.25z"
              />
              <path
                id="XMLID_462_"
                d="M193,236.75h15v15c0,8.284,6.716,15,15,15s15-6.716,15-15v-15h15c8.284,0,15-6.716,15-15s-6.716-15-15-15
		h-15v-15c0-8.284-6.716-15-15-15s-15,6.716-15,15v15h-15c-8.284,0-15,6.716-15,15S184.716,236.75,193,236.75z"
              />
            </g>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            fill="currentColor"
            id="2"
            className="bi bi-pencil-square inline-block m-2 rounded-md hover:bg-gray-200 cursor-pointer"
            viewBox="0 0 16 16"
            onClick={() => { changeOption(2) }}
          >
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path
              fillRule="evenodd"
              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={16}
            height={16}
            fill="currentColor"
            id="3"
            className="bi bi-trash-fill inline-block m-2 rounded-md hover:bg-gray-200 cursor-pointer"
            viewBox="0 0 16 16"
            onClick={() => { changeOption(3) }}
          >
            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
          </svg>

        </div>
        <p className="leading-relaxed text-base">{subtitle}</p>

        {(option === 1) &&
          <div className="w-full">
            <div className="pt-2 text-gray-600 w-fit relative">
              <input
                className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                type="search"
                name="search"
                placeholder="Email"
                value={keyword}
                onChange={(e) => { setKeyword(e.target.value) }}
              />
              <button type="submit" className="absolute right-0 top-0 mt-5 mr-4"
                onClick={(e) => {
                  e.preventDefault
                  fetch(`/api/v1/user?email=${keyword}`)
                    .then((response) => response.json())
                    .then((data) => setFoundUser(data.user))
                    .catch((err) => console.log(err))
                }}
              >
                <svg
                  className="text-gray-600 h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  id="Capa_1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 56.966 56.966"
                  xmlSpace="preserve"
                  width="512px"
                  height="512px"
                >
                  <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                </svg>
              </button>
            </div>
          </div>
        }
        {(option === 1) && foundUser &&
          <div></div>
        }
      </div>
    </div>
  )
}

export default JourneyCard
