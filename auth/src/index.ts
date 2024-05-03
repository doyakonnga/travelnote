import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { signupRouter } from './routes/signup-router'
import { loginRouter } from './routes/login-router'
import { reqUser } from './middlewares/req-user'
import { journeyRouter } from './routes/journey-router'
export const app = express()

app.set('trust proxy', true)
app.use(express.json())
app.use(cookieSession({ signed: false }), reqUser)

app.use('/user/signup', signupRouter)
app.use('/user/login', loginRouter)
app.use('/user/currentuser', (req, res) => res.json(req.user))
app.use('/journey', journeyRouter)

app.listen(3000, () => {
  console.log('listening on port 3000')
})
