import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { reqUser } from './middlewares/req-user'
import { requireInJourney } from './middlewares/require-in-journey'
const app = express()

const v = '/api/v1'

app.use(express.json())
app.use(
  cookieSession({ signed: false }),
  reqUser,
  requireInJourney
)

app.use(`${v}/consumption`)
app.use(`${v}/expense`)
app.use(`${v}/balance`)