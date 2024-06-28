import connectRedpanda from './redpanda'
import { app } from './app'

const start = async () => {
  try {
    const [producer, consumer] = await connectRedpanda
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