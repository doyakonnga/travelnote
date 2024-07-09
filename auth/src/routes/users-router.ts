import express from 'express'
import { allUser, findUser, updateUser, userById, userJourneys, userWithJourneyById } from '../prisma-client'
import jsonwebtoken from 'jsonwebtoken'
import { body, param } from 'express-validator'
import { validation } from '@dkprac/common'

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
  return res.status(200).json({ user: req.user || null })
})

userRouter.get('/renewtoken', async (req, res) => {
  if (!req.user?.id)
    return res.status(200).json({ message: '{ user: null }'})

  const user = await userWithJourneyById(req.user.id)
  if (!user) { req.session = null }
  else {
    const {id, email, name, avatar } = user
    const journeyIds = user.journeys.map((j) => j.id)
    req.session = { jwt: jsonwebtoken.sign({
      id, email, 
      name: name || undefined, 
      avatar: avatar || undefined, 
      journeyIds
    }, process.env.JWT_KEY!) }
    console.log('setCookie: ', jsonwebtoken.verify(req.session.jwt, process.env.JWT_KEY!))
  }

  return res.status(200).json({ message: 'JWT session renewed' })
})

userRouter.get('/:id',
  param('id').isString(),
  validation,
  async (req, res) => {
    const user = await userById(req.params!.id)
    return res.status(200).json({ user })
  })

userRouter.patch('/:id',
  param('id').isString(),
  validation,
  async (req, res) => {
    const user = await updateUser({
      id: req.params!.id,
      name: req.body.name || undefined,
      avatar: req.body.avatar || undefined
    })
    // renew token
    req.user.avatar = user.avatar || undefined
    req.user.name = user.name || undefined
    req.session = {
      jwt: jsonwebtoken.sign(req.user, process.env.JWT_KEY!)
    }
    return res.status(200).json({ user })
  }
)

