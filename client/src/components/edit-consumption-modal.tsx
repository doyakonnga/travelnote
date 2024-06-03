'use client'

import axios from "axios"
import { useFormState, useFormStatus } from "react-dom"
import Alert from "./alert"
import { Dispatch, SetStateAction, useState } from "react"
import { randomBytes } from "crypto"
import { refresh } from "./actions"
import Spinner from "./spinner"


interface FormState {
  id: string
  message: string
}

const ButtonBar = ({ handleClose }: { handleClose: ()=> void }) => {
  const { pending } = useFormStatus()
  return pending? <Spinner/>: (
    <div className="flex justify-between">
      <button type="button" className="my-3 w-5/12 max-w-60 flex justify-center bg-gray-100 text-stone-800 p-2 rounded-md tracking-wide hover:bg-neutral-50 focus:outline-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-50 transition-colors duration-200"
        onClick={() => { handleClose() }}
      >
        Cancel
      </button>
      <button className="my-3 w-5/12 max-w-60 flex justify-center bg-gray-800 text-white p-2 rounded-md tracking-wide hover:bg-black focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200">
        Save
      </button>
    </div>
  )
}

const EditConsumptionModal = ({ consumption, setConsumpState, users, handleClose }: {
  consumption: Consumption;
  setConsumpState: Dispatch<SetStateAction<Consumption>>
  users: Member[];
  handleClose: (id?: string, message?: string) => void
}) => {
  const handleSave = async (
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
      const { data } = await axios.put("/api/v1/consumption", {
        journeyId: consumption.journeyId,
        id: consumption.id,
        name,
        isForeign,
        rate,
        expenses
      })
      setConsumpState(data.consumption as Consumption)
      const id = randomBytes(4).toString('ascii')
      handleClose(id, 'Success; Consumption has been edited.')
      return {
        id,
        message: 'success'
      }
    } catch (e) {
      console.log(e)
      return {
        id: randomBytes(4).toString('ascii'),
        message: 'failure'
      }
    }
  }
  const [formState, formAction] = useFormState(handleSave, {
    id: '',
    message: ''
  })

  return (
    <div className="fixed inset-0 m-0 z-20 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="z-30 bg-white p-2 rounded">
        <form action={formAction} className='space-y-2 bg-slate-200 border-slate-300 rounded-md px-6 py-4'>
          <div className="flex justify-between border-b-4 border-gray-400 pb-4 ">
            <label htmlFor="total" className="block shrink-0 w-2/12 flex items-center">Item</label>
            <input type="text" name="item" placeholder="Item name" className="w-10/12 mt-1 p-1 rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" defaultValue={consumption.name} />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id='isForeign' name='isForeign' value='true' defaultChecked={consumption.isForeign} />
            <label htmlFor="isForeign" className="mx-1"> is foreign currency</label>
          </div>
          <input type="number" step="any" id='rate' name='rate'
            placeholder="Exchange Rate" defaultValue={consumption.rate}
            className="mt-1 p-1 w-40 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
          />

          {users.map((u) => (
            <div key={u.id} className="flex justify-between">
              <label htmlFor={u.id} className="block shrink-0 w-4/12 flex items-center space-1">
                <img className="flex-shrink-0 object-cover mx-1 rounded-full w-9 h-9" src={u.avatar || '/user.png'} alt="user avatar" />
                {u.name}
              </label>
              <input type="number" step="any" id={u.id} name={u.id}
                className="mt-1 p-1 w-40 border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
                defaultValue={consumption.expenses
                  .find((ex) => ex.userId === u.id)?.amount || ''}
              // onChange={(e) => { }}
              />
            </div>
          ))}
          
          <ButtonBar handleClose={handleClose}/>

          {formState.message === 'failure' && <Alert color={"red"} id={formState.id}> Adding failure! </Alert>}

        </form>
      </div>
    </div>
  )
}

export default EditConsumptionModal
