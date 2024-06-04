import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { reqUser } from './middlewares/req-user'
import { errorHandler } from './middlewares/error-handler'
import { albumRouter } from './routes/album-router'
import { photoRouter } from './routes/photo-router'
import connectRedpanda from './redpanda'
import { JourneyListener, ConsumptionListener, redpandaListen } from './events/listeners'

const app = express()

const v = '/api/v1'

app.set('trust proxy', true)
app.use(express.json())
app.use(
  cookieSession({ signed: false }),
  reqUser,
)

app.use(`${v}/album`, albumRouter)
app.use(`${v}/photo`, photoRouter)
app.all('*', (req, res) => { throw '404' })

app.use(errorHandler)

const start = async () => {
  try {
    const [producer, consumer] = await connectRedpanda
    console.log('connected to redpanda')
    
    await redpandaListen(
      consumer, 
      JourneyListener, 
      ConsumptionListener
    )

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