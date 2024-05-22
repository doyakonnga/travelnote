import express, { Router, RequestHandler } from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { signupRouter } from './routes/signup-router'
import { loginRouter } from './routes/login-router'
import { reqUser } from './middlewares/req-user'
import { journeyRouter } from './routes/journey-router'
import { journeyEditRouter } from './routes/journey-edit-router'
import { userRouter } from './routes/users-router'
import { oauthRouter } from './routes/oauth-router'
import { errorHandler } from './middlewares/error-handler'
import connectRedpanda from './redpanda'
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
app.use(`${v}/user/oauth`, oauthRouter)
app.use(`${v}/user`, userRouter)
app.use(`${v}/journey`, journeyRouter)
app.use(`${v}/journey/edit`, journeyEditRouter)

app.all('*', (req, res) => {
  throw '404'
})

app.use(errorHandler)

const start = async () => {
  try {
    const [producer, consumer] = await connectRedpanda
    console.log('connected to redpanda')
    process.on('SIGINT', () => {
      producer.disconnect
      // process.kill(process.pid, "SIGINT")
    });
    process.on('SIGTERM', () => producer.disconnect);
  } catch(e) { console.error(e) }

  app.listen(3000, () => {
    console.log('listening on 3000')
  })

}

start()