
'use client'

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"


const UserInfo = ({ user }: { user: Member }) => {
  const router = useRouter()
  const [name, setName] = useState(user.name)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-16 h-16">
        <img className="rounded-full"
          src={user.avatar || '/gray.png'}
          alt='user avatar'
        />
      </div>
      <h1 className="mt-2.5 mb-1">Email: {user.email}</h1>
      <div>
        <label htmlFor="name"></label>
        <input id="name" type="text" value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex justify-around">
        <button type="button" className="my-3 w-5/12 max-w-60 flex justify-center bg-gray-800 text-white p-2 rounded-md tracking-wide hover:bg-black focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200"
          onClick={() => { }}
        >
          OK
        </button>
        <button type="button" className="my-3 w-5/12 max-w-60 flex justify-center bg-gray-100 text-stone-800 p-2 rounded-md tracking-wide hover:bg-neutral-50 focus:outline-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-50 transition-colors duration-200"
          onClick={() => router.push('/')}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default UserInfo
