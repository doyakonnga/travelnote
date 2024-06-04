
import { Consumer, EachMessagePayload } from 'kafkajs'
import { JourneyListener } from './journey-listener'
import { ConsumptionListener } from './consumption-listener'
import { Event, Listener } from '../../common'

export * from './journey-listener'
export * from './consumption-listener'

export async function redpandaListen(
  consumer: Consumer,
  ...Listeners: (typeof JourneyListener | typeof ConsumptionListener)[]) {
  const listeners: (JourneyListener | ConsumptionListener)[] = []
  Listeners.forEach((l) => listeners.push(new l(consumer)))
  for (const l of listeners)
    await l.subscribe()

  await consumer.run({
    eachMessage: async (
      { topic, partition, message }: EachMessagePayload) => {
      // throw new Error('test');
      for (const l of listeners) {
        if (topic === l['topic']) {
          const value = JSON.parse(message.value as any)
          const { offset } = message
          const commit = async () => {
            await consumer.commitOffsets([{
              topic,
              partition,
              offset: (Number(message.offset) + 1).toString()
            }]);
          }
          await l.onMessage({ value, offset, commit })
        }
      }
    }
  })
}