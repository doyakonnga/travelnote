import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { reqUser } from './middlewares/req-user'
import { requireInJourney } from './middlewares/require-in-journey'
import { errorHandler } from './middlewares/error-handler'
import { consumptionRouter } from './routes/consumption-router'
import { expenseRouter } from './routes/expense-router'
import connectRedpanda from './redpanda'
import { JourneyListener } from './events/listeners.ts/journey-listener'
import { Listener } from './common'
const app = express()

const v = '/api/v1'

app.set('trust proxy', true)
app.use(express.json())
app.use(
  cookieSession({ signed: false }),
  reqUser,
)

app.use(`${v}/consumption`, requireInJourney, consumptionRouter)
app.use(`${v}/expense`, expenseRouter)
// app.use(`${v}/balance`)
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