import { app } from './app'
import { JourneyListener, ConsumptionListener } from './events/listeners'
import { redpanda, kafkaListen, E } from '@dkprac/common'

const start = async () => {
  try {
    const [producer, consumer] = await redpanda.connect('photo')
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