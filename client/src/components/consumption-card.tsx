
'use client'

import axios from "axios"
import { useState } from "react"

const ConsumptionCard = ({ consumption, members }: {
  consumption: Consumption
  members: Member[]
}) => {
  const [consumpState, setConsumpState] = useState(consumption)
  const [editedEx, setEditedEx] = useState('')
  const handleIsPaidChange = async (ex: Expense) => {
    setEditedEx('')
    try {
      await axios.patch(`/api/v1/expense/${ex.id}`, { isPaid: !ex.isPaid })
      setConsumpState((prev => {
        const exs = prev.expenses.map((e) => {
          if (e.id === ex.id) 
            return { ...e, isPaid: !ex.isPaid }      
          return e
        })
        return { ...prev, expenses: exs }
      }))
    } catch (e) {
      console.log(e)

    }
  }

  const editButton = (props: {}) => (<svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    fill="currentColor"
    id="2"
    className="bi bi-pencil-square inline-block ml-2 mr-auto rounded-md hover:bg-gray-200 cursor-pointer"
    viewBox="0 0 16 16"
    {...props}
  >
    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
    <path
      fillRule="evenodd"
      d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
    />
  </svg>)

  return (
    <div className='flex flex-wrap space-y-2 bg-slate-600 border-slate-700 rounded-md p-4'>
      <h1 className="w-full space-x-2 ml-2">
        <span className="text-white">{consumpState.name}</span>
        {editButton({})}
      </h1>
      {consumpState.expenses.map((ex) => {
        const user = members.find((m) => m.id === ex.userId)
        return (
          // each expense
          <div key={ex.id} className={"w-8/12 min-w-64 flex rounded-md ml-auto mr-2 p-1 space-x-1 " + (ex.isPaid ? 'bg-teal-400' : 'bg-rose-400')}>
            {/* edit button */}
            {(consumpState.payingUserId !== ex.userId) &&
              editButton({
                onClick: () => {
                  setEditedEx((prev) => (prev === ex.id) ? '' : ex.id)
                }
              })
            }
            {/* checkbox for isPaid */}
            {(editedEx === ex.id) &&
              <div className="inline-block ml-2 mr-auto">
                <input type="checkbox" id="isPaid" value="true" checked={ex.isPaid} onChange={() => handleIsPaidChange(ex)} />
                <label htmlFor="isPaid"> is paid</label>
              </div>
            }
            <div className="shrink-0 w-3/12 min-w-32 ml-auto space-x-1">
              <img className="inline flex-shrink-0 object-cover mx-1 rounded-full w-7 h-7" src={user?.avatar || '/user.png'} alt="user avatar" />
              <span>{(user?.name || "user")}</span>
            </div>
            <div className="shrink-0 w-2/12 text-end pr-2 flex items-center justify-end">
              {ex.amount}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ConsumptionCard