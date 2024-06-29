import express from 'express'
import { scrypt, randomBytes } from 'crypto'
import { createUser, findUser } from '../prisma-client'
import { body } from 'express-validator'
import { validation } from '../middlewares/validation-result'

export const signupRouter = express.Router()

signupRouter.post('/',
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6, max: 20 })
    .withMessage('Password must be between 6 and 20 characters'),
  validation,
  async (req, res) => {
    interface signupAttr { email: string, password: string, name?: string }
    let { email, password, name }: signupAttr = req.body
    if (await findUser({ email })) throw 'email in use'

    const salt = randomBytes(8).toString('hex')
    scrypt(password, salt, 64, async (err, buf) => {
      password = `${buf.toString('hex')}.${salt}`
      const user = await createUser({ email, password, name })
      return res.status(201).json({ user: { ...user, password: undefined } })
    })
  })
