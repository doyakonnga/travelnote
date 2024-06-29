import express from 'express'
import jsonwebtoken from 'jsonwebtoken'
import { scrypt } from 'crypto'
import { findUser } from '../prisma-client'

export const loginRouter = express.Router()

loginRouter.post('/', async (req, res, next) => {

  interface loginAttr { email: string, password: string }
  const { email, password }: loginAttr = req.body
  let user = await findUser({ email })
  if (!user) throw 'email not exist'
  const [hashed, salt] = user.password.split('.')

  const asyncScrypt = (): Promise<Buffer> => new Promise((resolve, reject) => {
    scrypt(password, salt, 64, async (err, buf) => {
      if (err) return reject(err)
      return resolve(buf)
    })
  })
  const buf = await asyncScrypt()

  if (buf.toString('hex') !== hashed) return next('password incorrect')

  const journeyIds = user.journeys.map((j) => j.id)
  const userToken: Express.UserToken = {
    id: user.id,
    email: user.email,
    name: user.name || undefined,
    avatar: user.avatar || undefined,
    journeyIds
  }
  const jwt = jsonwebtoken.sign(userToken, process.env.JWT_KEY!)
  req.session = { jwt }
  return res.status(200).json({ user: { ...user, password: undefined } })

})

