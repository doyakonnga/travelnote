import express, { Router, RequestHandler } from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { signupRouter } from './routes/signup-router'
import { loginRouter } from './routes/login-router'
import { reqUser } from './middlewares/req-user'
import { journeyRouter } from './routes/journey-router'
import { journeyEditRouter } from './routes/journey-edit-router'
import { allUserRouter } from './routes/all-users-router'
import { oauthRouter } from './routes/oauth-router'
import { errorHandler } from './middlewares/error-handler'
export const app = express()

const v = '/api/v1'

app.set('trust proxy', true)
app.use(express.json())
app.use(cookieSession({ signed: false }), reqUser)


app.use(`${v}/user/signup`, signupRouter)
app.use(`${v}/user/login`, loginRouter)
app.use(`${v}/user/logout`, (req, res) => {
  req.session = null
  return res.redirect('/')
})
app.use(`${v}/user/currentuser`, (req, res) => {
  console.log('get request')
  if (!req.user) return res.json({user: null})
  return res.json({user: req.user})
})
app.use(`${v}/user/oauth`, oauthRouter)
app.use(`${v}/user`, allUserRouter)
app.use(`${v}/journey`, journeyRouter)
app.use(`${v}/journey/edit`, journeyEditRouter)

app.all('*', (req, res) => {
  throw '404'
})

app.use(errorHandler)


app.listen(3000, () => {
  console.log('listening on port 3000')
})
