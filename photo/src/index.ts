import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { reqUser } from './middlewares/req-user'
import { errorHandler } from './middlewares/error-handler'
import { albumRouter } from './routes/album-router'
import { photoRouter } from './routes/photo-router'
import { redpandaConnect, kafkaListen } from './common'
import { JourneyListener, ConsumptionListener } from './events/listeners'

const app = express()

const v = '/api/v1'

app.set('trust proxy', true)
app.use(express.json())
app.use(
  cookieSession({ signed: false }),
  reqUser,
)

app.use(`${v}/albums`, albumRouter)
app.use(`${v}/photos`, photoRouter)
app.all('*', (req, res) => { throw '404' })

app.use(errorHandler)

const start = async () => {
  try {
    const [producer, consumer] = await redpandaConnect('photo')
    console.log('connected to redpanda')
    
    await kafkaListen(
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