import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { reqUser } from './middlewares/req-user'
import { requireInJourney } from './middlewares/require-in-journey'
import { errorHandler } from './middlewares/error-handler'
import { consumptionRouter } from './routes/consumption-router'
import { expenseRouter } from './routes/expense-router'
import { balanceRouter } from './routes/balance-router'
import { JourneyListener } from './events/listeners/journey-listener'
import connectRedpanda from './redpanda'
const app = express()

const v = '/api/v1'

app.set('trust proxy', true)
app.use(express.json())
app.use(
  cookieSession({ signed: false }),
  reqUser,
)

app.use(`${v}/consumptions`, requireInJourney, consumptionRouter)
app.use(`${v}/expenses`, expenseRouter)
app.use(`${v}/balances`, requireInJourney, balanceRouter)
app.all('*', (req, res) => { throw '404' })

app.use(errorHandler)

const start = async () => {
  try {
    const [producer, consumer] = await connectRedpanda
    console.log('connected to redpanda')
    await new JourneyListener(consumer).listen()
    process.on('SIGINT', () => {
      producer.disconnect()
      consumer.disconnect()
    });
    process.on('SIGTERM', () => {
      producer.disconnect()
      consumer.disconnect()
    });
  } catch (e) { console.error(e) }
  app.listen(3000, () => {
    console.log('listening on 3000')
  })

}

start()