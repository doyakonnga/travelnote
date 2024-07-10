import express, { Router, RequestHandler } from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { signupRouter } from './routes/signup-router'
import { loginRouter } from './routes/login-router'
import { reqUser, errorHandler } from '@dkprac/common'
import { journeyRouter } from './routes/journey-router'
import { userRouter } from './routes/users-router'
import { oauthRouter } from './routes/oauth-router'
import { journeyMemberRouter } from './routes/journey-member-router'

export const app = express()
export const v = '/api/v1'

app.set('trust proxy', true)
app.use(express.json())
app.use(cookieSession({ 
  signed: false,
  // secure: process.env.NODE_ENV !== 'test'
 }), reqUser)

app.use(`${v}/users/signup`, signupRouter)
app.use(`${v}/users/login`, loginRouter)
app.use(`${v}/users/logout`, (req, res) => {
  req.session = null
  return res.redirect('/')
})
app.use(`${v}/users/oauth`, oauthRouter)
app.use(`${v}/users`, userRouter)
app.use(`${v}/journeys/members`, journeyMemberRouter)
app.use(`${v}/journeys`, journeyRouter)

app.all('*', (req, res) => {
  throw '404'
})

app.use(errorHandler)