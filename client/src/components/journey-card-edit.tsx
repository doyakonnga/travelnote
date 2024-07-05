'use client'

import axios from "axios"
import Image from "next/image"
import { ChangeEvent, useState } from "react"
import Alert from './alert'
import ConfirmModal from "./confirm-modal"
import { OldBin, OldEditing, OldInviting } from "./svg"

interface Props {
  journeyId: string
  title: string
  subtitle: string | null
  picture: string | null
}
interface User {
  id: string
  name: string
  email: string
  avatar: string
}
type Option = 0 | 1 | 2 | 3
type Uploaded = { file: File, objectUrl: string } | null
const JourneyCard = (props: Props) => {
  const { journeyId: id, title, subtitle, picture } = props
  // 1: inviting, 2: editing, 3: quiting
  const [option, setOption] = useState<Option>(0)
  // Option1, Inviting
  const [keyword, setKeyword] = useState('')
  const [foundUser, setFoundUser] = useState<User | null>(null)
  // Option 2, Editing
  const [query, setQuery] = useState({ id, title, subtitle, picture })
  const [uploaded, setUploaded] = useState<Uploaded>(null)

  const [confirmModal, setConfirmModal] = useState('')
  const [reqState, setReqState] = useState({ result: '', message: '' })
  const [loading, setLoading] = useState(false)
  const changeOption = (n: Option) => {
    if (option === 2) {
      if (uploaded?.objectUrl)
        URL.revokeObjectURL(uploaded.objectUrl)
      setUploaded(null)
      setQuery({ id, title, subtitle, picture })
    }
    setOption(p => (n === p) ? 0 : n)
  }
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (uploaded) URL.revokeObjectURL(uploaded.objectUrl)
    const file = e.target.files?.[0];
    if (!file) setUploaded(null)
    else setUploaded({ file, objectUrl: URL.createObjectURL(file) })
  }
  const handleConfirm = async () => {
    if (option === 1) {
      try {
        setLoading(true)
        if (!foundUser) throw new Error('user not found')
        await axios.post('/api/v1/journey/edit', {
          id,
          members: [{ id: foundUser.id }]
        })
        setKeyword('')
        setFoundUser(null)
        setReqState({
          result: 'success',
          message: 'The user has been invited to the journey group.'
        })
      } catch (e) {
        console.log(e)
        setReqState({
          result: 'failure',
          message: 'Failure; please try again later.'
        })
      } finally {
        setConfirmModal('')
        setLoading(false)
      }
    } else if (option === 3) {
      try {
        await axios.patch('/api/v1/journey/edit', {
          id,
          quitingMemberId: ''
        })
      } catch (e) { console.log(e) }
    }
  }

  return (
    <div key={id} className="w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 p-4 mx-auto z-10">
      <div className="bg-white p-6 rounded-lg grid grid-cols-2">
        {/* Picture */}
        {option === 2 ?
          <label className="col-span-2 cursor-pointer" htmlFor="file">
            <Image className="h-72 rounded w-full object-cover object-center mb-6"
              src={uploaded?.objectUrl || query.picture || '/landscape.jpg'}
              alt="journey picture" width={720} height={400} />
            <input id="file" type="file" hidden onChange={handleChange}/>
          </label>
          :
          <Image className="h-72 col-span-2 rounded w-full object-cover object-center mb-6"
            src={query.picture || '/landscape.jpg'}
            alt="journey picture" width={720} height={400} />
        }
        {/* Title */}
        {option === 2 ?
          <div className="mb-4 inline-block">
            <label htmlFor="title">Title: </label>
            <input id="title" type="text" className="border-2 border-gray-300 bg-white h-10 mx-2 px-3 rounded-lg text-sm focus:outline-none"
              value={query.title || ''}
              onChange={e => setQuery(p => ({ ...p, title: e.target.value }))} />
          </div> :
          <h1 className="text-lg text-gray-900 font-medium title-font mb-4 inline-block">{query.title}</h1>
        }
        {/* Buttons */}
        <div className="inline-block ml-auto">
          <OldInviting selected={option === 1} onClick={() => changeOption(1)} />
          <OldEditing selected={option === 2} onClick={() => changeOption(2)} />
          <OldBin onClick={() => {
            changeOption(3)
            setConfirmModal('Are you sure you want to quit the journey? Please note that if you are last user, all of data in this group will be lost permanently.')
          }} />
        </div>
        {/* Subtitle */}
        {option === 2 ?
          <div className="mb-4 inline-block">
            <label htmlFor="subtitle">Subtitle: </label>
            <input id="subtitle" className="border-2 border-gray-300 bg-white h-10 mx-2 px-3 rounded-lg text-sm focus:outline-none" type="text" value={query.subtitle || ''}
              onChange={e => setQuery(p => ({ ...p, subtitle: e.target.value }))} />
          </div> :
          <p className="leading-relaxed text-base">{query.subtitle}</p>
        }
        {/* Save and Cancel */}
        {option === 2 &&
          <div className="flex justify-end gap-5">
            <button type="button" className="my-3 flex justify-center bg-gray-800 text-white p-2 rounded-md tracking-wide hover:bg-black focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200"
              onClick={() => { }}
            >
              Save
            </button>
            <button type="button" className="my-3 flex justify-center bg-gray-100 text-stone-800 p-2 rounded-md tracking-wide hover:bg-neutral-50 focus:outline-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-50 transition-colors duration-200"
              onClick={() => {
                setOption(0)
                setQuery({ id, title, subtitle, picture })
                setUploaded(null)
              }}
            >
              Cancel
            </button>
          </div>
        }

        {/* Adding user */}
        {/* search bar */}
        {(option === 1) &&
          <div className="w-full col-span-2">
            <div className="pt-2 text-gray-600 w-fit relative">
              <input
                className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                type="search"
                name="search"
                placeholder="Email"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value)
                  setFoundUser(null)
                }}
              />
              <button type="button" className="absolute right-0 top-0 mt-5 mr-4"
                onClick={(e) => {
                  setLoading(true)
                  fetch(`/api/v1/user?email=${keyword}`)
                    .then((response) => response.json())
                    .then((data) => setFoundUser(data.user))
                    .catch((err) => console.log(err))
                    .finally(() => setLoading(false))
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
        {(option === 1) && loading &&
          <h1>Loading...</h1>
        }
        {(option === 1) && foundUser &&
          <div className="flex space-3">
            <div className="shrink-0 w-3/12 min-w-32 ml-auto space-x-1 flex items-center">
              <img className="inline flex-shrink-0 object-cover mx-1 rounded-full w-7 h-7" src={foundUser.avatar || '/user.png'} alt="user avatar" />
              <span>{foundUser.name}</span>
            </div>
            <button type="button" className="my-3 w-5/12 max-w-60 flex justify-center bg-gray-800 text-white p-2 rounded-md tracking-wide hover:bg-black focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200"
              onClick={() => {
                setConfirmModal('Are you sure you want to add this user to the journey? The invited user will only be removed from the group if they voluntarily leave.')
              }}
            >
              Invite
            </button>
          </div>
        }

        {confirmModal &&
          <ConfirmModal text={confirmModal} loading={loading} handleOk={handleConfirm} handleCancel={() => { setConfirmModal('') }} />
        }

      </div>
      {(reqState.result === 'success') &&
        <Alert color="green" id=''>{reqState.message}</Alert>}
      {(reqState.result === 'failure') &&
        <Alert color="red" id=''>{reqState.message}</Alert>}
    </div>
  )
}

export default JourneyCard
