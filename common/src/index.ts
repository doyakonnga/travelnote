import { Consumer, EachMessagePayload, Producer } from "kafkajs"
import { Topics, Event } from "./events"


export abstract class Listener<E extends Event> {
  abstract topic: E["topic"]
  abstract onMessage(props: {
    value: E["value"]
    offset: string
    commit: () => Promise<void>
  }): void
  constructor(protected consumer: Consumer) { }
  async subscribe() {
    await this.consumer.subscribe({
      topic: this.topic,
      fromBeginning: true
    })
  }
}

export abstract class Publisher<E extends Event> {
  abstract topic: Topics
  constructor(protected producer: Producer) { }
  async send(key: string, value: E["value"]) {
    await this.producer.send({
      topic: this.topic,
      messages: [{ key, value: JSON.stringify(value) }]
    })
  }
}

type ExtendedListener = (new (c: Consumer) => Listener<Event>)
// & { [K in keyof typeof Listener]: typeof Listener[K] }
// https://stackoverflow.com/questions/67558444/typescript-type-of-subclasses-of-an-abstract-generic-class

export async function kafkaListen(
  consumer: Consumer,
  ...Listeners: ExtendedListener[]) {
  // subscribe
  // const listeners: (InstanceType<ExtendedListener>)[] = []
  const listeners = Listeners.map(L => new L(consumer))
  await Promise.all(listeners.map(l => l.subscribe()))
  // run
  await consumer.run({
    eachMessage: async (
      { topic, partition, message }: EachMessagePayload) => {
      // throw new Error('test');
      const listener = listeners.find((l) => topic === l['topic'])
      if (listener) {
        const value = JSON.parse(message.value as any)
        const { offset } = message
        const commit = async () => {
          await consumer.commitOffsets([{
            topic,
            partition,
            offset: (Number(message.offset) + 1).toString()
          }]);
        }
        await listener.onMessage({ value, offset, commit })
      }
    }
  })
}

export * from './middlewares'
export * from './events'
export * from './redpanda'