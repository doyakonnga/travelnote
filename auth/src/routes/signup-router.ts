import express from 'express'
import { scrypt, randomBytes } from 'crypto'
import { createUser } from '../prisma-client'

export const signupRouter = express.Router()

signupRouter.post('/', async (req, res) => {
  interface signupAttr { email: string, password: string, name?: string }
  let { email, password, name }: signupAttr = req.body
  const salt = randomBytes(8).toString('hex')

  scrypt(password, salt, 64, async (err, buf) => {
    password = `${buf.toString('hex')}.${salt}`
    const user = await createUser({ email, password, name })
    res.status(200).json(user)
  })
})
