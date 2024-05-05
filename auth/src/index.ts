import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { signupRouter } from './routes/signup-router'
import { loginRouter } from './routes/login-router'
import { reqUser } from './middlewares/req-user'
import { journeyRouter } from './routes/journey-router'
import { journeyEditRouter } from './routes/journey-edit-router'
import { allUserRouter } from './routes/all-users-router'
import { oauthRouter } from './routes/oauth-router'
export const app = express()

app.set('trust proxy', true)
app.use(express.json())
app.use(cookieSession({ signed: false }), reqUser)

app.use('/user/signup', signupRouter)
app.use('/user/login', loginRouter)
app.use('/user/currentuser', (req, res) => res.json(req.user))
app.use('/user/oauth', oauthRouter)
app.use('/user', allUserRouter)
app.use('/journey', journeyRouter)
app.use('/journey/edit', journeyEditRouter)


app.listen(3000, () => {
  console.log('listening on port 3000')
})
