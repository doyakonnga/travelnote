import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { reqUser } from './middlewares/req-user'
import { requireInJourney } from './middlewares/require-in-journey'
import { errorHandler } from './middlewares/error-handler'
import { consumptionRouter } from './routes/consumption-router'
import { expenseRouter } from './routes/expense-router'
const app = express()

const v = '/api/v1'

app.use(express.json())
app.use(
  cookieSession({ signed: false }),
  reqUser,
  requireInJourney
)

app.use(`${v}/consumption`, consumptionRouter)
app.use(`${v}/expense`, expenseRouter)
// app.use(`${v}/balance`)
app.all('*', (req, res) => { throw '404' })

app.use(errorHandler)

app.listen(3000, () => console.log('listening on 3000'))