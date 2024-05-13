'use client'

import { useFormState } from "react-dom"

interface ExpenAttr {
  userId: string
  amount: number
}
interface FormState {
  message: string
}


const CreateConsumptionForm = (users: Member[]) => {
  const handleSubmit = async (
    prevState: FormState,
    formData: FormData
  ) => {
    return {
      message: ''
    }
  }
  const [formState, formAction] = useFormState(handleSubmit, {
    message: ''
  })


  return (
    <form action={formAction}>
      <input type="checkbox" name='isForeign' value='true' />
      <input type="text" name='rate' />
      {users.map((u) => (
        <div>
          <label htmlFor={u.id}>{u.name}</label>
          <input type="text" id={u.id} name={u.id} />
        </div>
      ))}
    </form>
  )
}

export default CreateConsumptionForm
