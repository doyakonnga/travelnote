'use client'

import axios from "axios"
import { useState } from "react"
import { useFormState } from "react-dom"
import Alert from "./alert"

interface ExpenAttr {
  userId: string
  amount: number
}
interface FormState {
  message: string
}


const CreateConsumptionForm = ({ journeyId, users }: {
  journeyId: string; users: Member[]
}) => {

  const [amounts, setAmounts] = useState<{ [key: string]: number }>({
    total: 0,
    ...users.reduce((acc, cur) => { return { ...acc, [cur.id]: 0 } }, {})
  })

  const handleSubmit = async (
    prevState: FormState,
    formData: FormData
  ) => {
    const expenses = users.map((u) => {
      return {
        userId: u.id,
        amount: Number(formData.get(u.id))
      }
    })
    const name = formData.get('item')
    const isForeign = formData.get('isForeign') ? true : false
    const rate = Number(formData.get('rate'))
    try {
      await axios.post("/api/v1/consumption", {
        journeyId,
        name,
        rate,
        isForeign,
        expenses
      })
      return {
        message: 'success'
      }
    } catch (e) {
      console.log(e)
      return {
        message: 'failure'
      }
    }
  }
  const [formState, formAction] = useFormState(handleSubmit, {
    message: ''
  })


  return (
    <form action={formAction} className='space-y-2 bg-slate-200 border-slate-300 rounded-md px-6 py-4'>
      <div className="flex justify-between border-b-4 border-gray-400 pb-4 ">
        <label htmlFor="total" className="block shrink-0 w-2/12 flex items-center">Item</label>
        <input type="text" name="item" placeholder="Item name" className="w-10/12 mt-1 p-1 rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" />
      </div>
      <div className="flex">
        <div className="w-4/12 flex items-center space-x-2">
          <input type="checkbox" id='isForeign' name='isForeign' value='true' />
          <label htmlFor="isForeign" className="flex items-center mx-1"> is foreign currency</label>
        </div>
        <input type="number" step="any" id='rate' name='rate'
          placeholder="Exchange Rate"
          className="mt-1 p-1 w-40 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
        />
      </div>

      <div className="flex items-center border-b-4 border-gray-400 pb-4">
        <label htmlFor="total" className="block shrink-0 w-4/12 flex items-center">Total</label>
        <input type="number" id="total" name="total"
          className="mt-1 p-1 w-40 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
          value={amounts.total || ''}
          // when changing total value, zero every individual value
          onChange={(e) => {
            setAmounts((prev) => {
              Object.keys(prev).forEach((key) => {
                prev[key] = 0
              })
              return {
                ...prev,
                total: Number(e.target.value) || 0
              }
            })
          }}
        />
        <button type="button" className="m-auto w-3/12 max-w-40 flex justify-center bg-gray-400 text-stone-800 p-1 rounded tracking-wide"
          onClick={() => {
            setAmounts((prev) => {
              Object.keys(prev).forEach((key) => {
                if (key !== "total")
                  prev[key] = Math.round(prev.total / users.length * 100) / 100
              })
              return { ...prev }
            })
          }}
        >
          Split
        </button>
      </div>
      {users.map((u) => (
        <div key={u.id} className="flex">
          <label htmlFor={u.id} className="block shrink-0 w-4/12 flex items-center space-1">
            <img className="flex-shrink-0 object-cover mx-1 rounded-full w-9 h-9" src={u.avatar || '/user.png'} alt="user avatar" />
            {u.name}
          </label>
          <input type="number" step="any" id={u.id} name={u.id}
            className="mt-1 p-1 w-40 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
            value={amounts[u.id] || ''}
            onChange={(e) => {
              setAmounts((prev) => {
                const unchanged = Object.keys(prev).reduce((acc, cur) =>
                  acc + ((cur === 'total' || cur === u.id) ? 0 : prev[cur])
                  , 0)
                const input = Number(e.target.value) || 0
                return {
                  ...prev,
                  [u.id]: input,
                  total: unchanged + input
                }
              })
            }}
          />
        </div>
      ))}
      <div className="flex justify-between">
        <button type="button" className="my-3 w-5/12 max-w-60 flex justify-center bg-gray-100 text-stone-800 p-2 rounded-md tracking-wide hover:bg-neutral-50 focus:outline-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-50 transition-colors duration-200"
          onClick={() => setAmounts((prev) => {
            Object.keys(prev).forEach((key) => { prev[key] = 0 })
            return { ...prev }
          })}
        >
          Clear
        </button>
        <button className="my-3 w-5/12 max-w-60 flex justify-center bg-gray-800 text-white p-2 rounded-md tracking-wide hover:bg-black focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200">
          Submit
        </button>
      </div>

      {formState.message === 'success' && <Alert color={"green"} id={''}> Adding success! </Alert>}
      {formState.message === 'failure' && <Alert color={"red"} id={''}> Adding failure! </Alert>}
    </form>
  )
}

export default CreateConsumptionForm
