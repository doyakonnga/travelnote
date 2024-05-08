'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { handleSummit } from '@/app/server-action'
import { RedirectType, redirect, useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from 'axios'


const LoginForm = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { pending } = useFormStatus()
  const [formState, formAction] = useFormState(handleSummit, {
    message: '', 
    errors: [],
    cookies: []
  })

  if (formState.message === 'success') {
    axios.post('/api/v1/user/login', { email, password }).then(() => {
      router.replace('/');
      return router.refresh();
    });
  } 
  const errorFields = formState.errors.map((e) => e.field)
 
  return (
    <form action={formAction} method="POST" className="space-y-4">
      {/* Your form elements go here */}
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {errorFields.includes('password') && <span>wrong password</span>}
      <div>
        <button
          type="submit"
          className={"w-full text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 " + (pending ? "bg-grey" :"bg-black")}
          disabled={pending}
        >
          Log in
        </button>
      </div>
    </form>

  )
}

export default LoginForm
