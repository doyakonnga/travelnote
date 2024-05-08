'use server'

import axios from "axios"

interface FormState {
  message: string,
  errors: {
    field: string
    message: string
  }[],
  cookies: string[]
}

export const handleSummit = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState> => {

  try {
    console.log('handling summit')
    const { data, headers } = await axios.post(`${process.env.NGINX_HOST}/api/v1/user/login`, {
      email: formData.get('email'),
      password: formData.get('password')
    }, {headers: {
      Host: "travelnote.com"
    }})
    if(!headers['set-cookie']) 
      throw [{
        field: 'cookie',
        message: 'set-cookie not found in headers'
      }]
    console.log(headers['set-cookie'])
    return {
      message: 'success',
      errors: [],
      cookies: headers['set-cookie']
    }
  } catch (e) {
    return {
      message: 'error',
      errors: e as {
        field: string
        message: string
      }[],
      cookies: []
    }
  }
}