import express from 'express'
import { allUser, findUser, userById, userJourneys } from '../prisma-client'
import jsonwebtoken from 'jsonwebtoken'
import { param } from 'express-validator'

export const userRouter = express.Router()

userRouter.get('/', async (req, res) => {
  if (req.query?.email
    && typeof req.query?.email === 'string') {
    const user = await findUser({ email: req.query.email })
    return res.status(200).json({ user })
  }
  return res.status(200).json({ users: await allUser() })
})

userRouter.get('/currentuser', (req, res) => {
  console.log('currentUser: ', req.user || 'null')
  if (!req.user) return res.json({ user: null })
  return res.json({ user: req.user })
})

userRouter.get('/:id',
  param('id').isString(),
  async (req, res) => {
    const user = await userById(req.params!.id)
    return res.status(200).json({ user })
  })


userRouter.get('/renewtoken', async (req, res) => {
  if (!req.user?.id)
    return res.status(200).json()

  const journeys = await userJourneys(req.user.id)
  req.user.journeyIds = journeys.map((j) => j.id)
  req.session = { jwt: jsonwebtoken.sign(req.user, process.env.JWT_KEY!) }
  console.log('setCookie: ', jsonwebtoken.verify(req.session.jwt, process.env.JWT_KEY!))

  return res.status(200).json({ message: 'JWT session renewed' })
})