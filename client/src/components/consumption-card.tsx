
'use client'

import axios from "axios"
import { useEffect, useState } from "react"
import EditConsumptionModal from '@/components/edit-consumption-modal'
import Alert from "./alert"
import ConfirmModal from "./confirm-modal"
import { useRouter } from "next/navigation"
import { randomBytes } from "crypto"
import Spinner from "./spinner"
import ConsumptionPhotoAccordion from "./consumption-photo-accordion"

type ReqState = null | 'loading' | {
  result: 'success' | 'failure'
  id: string
  message: string
}

const ConsumptionCard = ({ consumption, members }: {
  consumption: Consumption
  members: Member[]
}) => {
  const router = useRouter()
  // update expenses
  const [consumpState, setConsumpState] = useState<Consumption>(consumption)
  const [editedEx, setEditedEx] = useState('')
  // update consumption
  const [displayEditModal, setDisplayEditModal] = useState(false)
  // delete consumption
  const [confirmDeleteModel, setConfirmDeleteModel] = useState(false)
  // request states
  const [reqState, setReqState] = useState<ReqState>(null)

  const handleIsPaidChange = async (ex: Expense) => {
    setEditedEx('')
    try {
      setReqState('loading')
      await axios.patch(`/api/v1/expenses/${ex.id}`, { isPaid: !ex.isPaid })
      setConsumpState((prev => {
        const exs = prev.expenses.map((e) => {
          if (e.id === ex.id)
            return { ...e, isPaid: !ex.isPaid }
          return e
        })
        return { ...prev, expenses: exs }
      }))
      setReqState({
        result: 'success',
        id: randomBytes(4).toString(),
        message: 'The expense was updated successfully.'
      })
    } catch (e) {
      console.log(e)
      setReqState({
        result: 'failure',
        id: randomBytes(4).toString(),
        message: 'Operation failed, Please try again later.'
      })
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

  const deleteButton = (props: {}) => {
    return (<svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      fill="currentColor"
      id="3"
      className="bi bi-trash-fill inline-block m-2 rounded-md hover:bg-gray-200 cursor-pointer"
      viewBox="0 0 16 16"
      {...props}
    >
      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
    </svg>)
  }

  return (
    <div className='flex flex-wrap space-y-2 bg-slate-600 border-slate-700 rounded-md p-4'
      id={consumption.id}>
      <h1 className="w-full space-x-2 ml-2">
        <span className="text-white">{consumpState.name}</span>
        {editButton({
          onClick: () => { setDisplayEditModal(true) }
        })}
        {deleteButton({
          onClick: () => { setConfirmDeleteModel(true) }
        })
        }
      </h1>
      {(reqState === 'loading') ? <Spinner /> :
        consumpState.expenses.map((ex) => {
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

      {/* {editModalMsg &&
        <Alert color="green" id={editModalId}>{editModalMsg}</Alert>
      } */}

      {(typeof reqState === 'object') && (reqState) &&
        (reqState.result === 'success' ?
          <Alert color={"green"} id={reqState.id}>{reqState.message}</Alert>
          : reqState.result === 'failure' ?
            <Alert color={"red"} id={reqState.id}>{reqState.message}</Alert>
            : <></>)
      }

      <ConsumptionPhotoAccordion consumption={consumption} />

      {displayEditModal &&
        <EditConsumptionModal
          consumption={consumpState}
          setConsumpState={setConsumpState}
          users={members}
          handleClose={(id?: string, message?: string) => {
            setDisplayEditModal(false)
            if (id && message)
              setReqState({ result: 'success', id, message })
          }} />
      }

      {confirmDeleteModel &&
        <ConfirmModal
          text="Are you sure you want to delete this consumption?"
          loading={reqState === 'loading'}
          handleOk={async () => {
            try {
              setReqState('loading')
              const { id, journeyId } = consumption
              const deletedConsumption = await axios
                .delete(`/api/v1/consumptions/${id}?journeyId=${journeyId}`)
              console.log('deleted: ', deletedConsumption)
              const randomId = randomBytes(4).toString('ascii')
              const message = 'The consumption has been deleted.'
              setReqState({
                result: 'success', id: randomId, message
              })
              router.replace(
                `/journey/${consumption.journeyId}/consumptions?id=${randomId}&message=${message}`
              )
            } catch (e) {
              console.log(e)
              setReqState({
                result: 'failure',
                id: randomBytes(4).toString(),
                message: 'Operation failed, Please try again later.'
              })
              router.refresh()
            } finally {
              setConfirmDeleteModel(false)
            }
          }}
          handleCancel={() => {
            setConfirmDeleteModel(false)
          }}
        />
      }


    </div>

  )
}

export default ConsumptionCard