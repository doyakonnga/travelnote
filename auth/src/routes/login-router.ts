import express from 'express'
import jsonwebtoken from 'jsonwebtoken'
import { scrypt } from 'crypto'
import { findUser } from '../prisma-client'

export const loginRouter = express.Router()

loginRouter.post('/', async (req, res) => {
  interface loginAttr { email: string, password: string }
  const { email, password }: loginAttr = req.body
  let user = await findUser({ email })
  if (!user) throw 'not exist'
  const [hashed, salt] = user.password.split('.')

  scrypt(password, salt, 64, async (err, buf) => {
    if (err) throw err
    if (buf.toString('hex') !== hashed) throw 'password incorrect'

    const journeyIds = user.journeys.map((j) => j.id)
    const userToken: Express.UserToken = {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      journeyIds
    }
    const jwt = jsonwebtoken.sign(userToken, process.env.JWT_KEY!)
    req.session = { jwt }
    return res.status(200).json({ ...user, password: undefined })
  })
})

