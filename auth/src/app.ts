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

app.use(`${v}/user/signup`, signupRouter)
app.use(`${v}/user/login`, loginRouter)
app.use(`${v}/user/logout`, (req, res) => {
  req.session = null
  return res.redirect('/')
})
app.use(`${v}/user/oauth`, oauthRouter)
app.use(`${v}/user`, userRouter)
app.use(`${v}/journey/members`, journeyMemberRouter)
app.use(`${v}/journey`, journeyRouter)

app.all('*', (req, res) => {
  throw '404'
})

app.use(errorHandler)