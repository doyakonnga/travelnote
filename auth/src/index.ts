import { app } from './app'
import { redpanda } from '@dkprac/common'

const start = async () => {
  try {
    const [producer, consumer] = await redpanda.connect('auth')
    console.log('connected to redpanda')
    process.on('SIGINT', () => {
      producer.disconnect()
      consumer.disconnect()
    });
    process.on('SIGTERM', () => {
      producer.disconnect()
      consumer.disconnect()
    });
  } catch(e) { console.error(e) }

  app.listen(3000, () => {
    console.log('listening on 3000')
  })

}

start()