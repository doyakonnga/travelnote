'use client'

import { useFormState, useFormStatus } from 'react-dom'
// import { handleSummit } from '@/app/server-action'
import { RedirectType, redirect, useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from 'axios'
import Alert from './alert'
import { randomBytes } from 'crypto'
import { error } from 'console'
import { refresh } from './actions'


interface Errors {
  response?: {
    data: {
      field: string
      message: string
    }[]
  }
}

interface FormState {
  id: string
  message: string
  errors: Errors
}


const LoginButton = () => {
  const { pending } = useFormStatus()
  return (
    < button
      type="submit"
      className={"w-full text-white p-2 rounded-md hover:bg-black focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200 " + (pending ? "bg-gray-300" : "bg-gray-800")}
      disabled={pending}
    >
      {pending ? 'Loding...' : 'Log in'}
    </button >)
}


const LoginForm = () => {
  const router = useRouter()

  const handleSummit = async (
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> => {
    try {
      const { data, headers } = await axios.post(`/api/v1/users/login`, {
        email: formData.get('email'),
        password: formData.get('password')
      })
      return {
        id: randomBytes(4).toString('hex'),
        message: 'success',
        errors: {},
      }
    } catch (e) {
      return {
        id: randomBytes(4).toString('ascii'),
        message: 'error',
        errors: e as Errors,
      }
    }
  }

  const [formState, formAction] = useFormState(handleSummit, {
    id: '',
    message: '',
    errors: {},
  })

  // console.log(formState.message)
  if (formState.message === 'success') {
    // router.replace('/');
    // return router.refresh();
    refresh()
  }
  const errorFields = formState.errors.response?.data.map((e) => e.field)
  // console.log(errorFields)
  console.log(formState.id)

  return (
    <form action={formAction} className="space-y-4">
      {/* Your form elements go here */}
      {formState.id}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="text"
          id="email"
          name="email"
          className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
        />
        {errorFields?.includes('email') &&
          <Alert color='red' id={formState.id}>Email not existing; please check again.</Alert>}
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300"
        />
        {errorFields?.includes('password') &&
          <Alert color='red' id={formState.id}>Password incorrect; please check again.</Alert>}
      </div>

      <div>
        <LoginButton />
      </div>
    </form>

  )
}

export default LoginForm
