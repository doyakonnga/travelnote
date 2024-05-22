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

  async listen() {
    await this.consumer.subscribe({
      topic: this.topic,
      fromBeginning: true
    })
    await this.consumer.run({
      eachMessage: async (
        { topic, partition, message }: EachMessagePayload) => {
        const value: E["value"] = JSON.parse(message.value as any)
        const { offset } = message
        const commit = async () => {
          await this.consumer.commitOffsets([{
            topic,
            partition,
            offset: (Number(message.offset + 1)).toString()
          }]);
        }
        await this.onMessage({ value, offset, commit })
      }
    })
  }
}

export abstract class Publisher<E extends Event> {
  abstract topic: Topics
  constructor(protected producer: Producer) { }
  async send(key: string, value: E["value"]) {
    try {
      await this.producer.send({
        topic: this.topic,
        messages: [{ key, value: JSON.stringify(value) }]
      })
    } catch(e) { console.error(e) }
  }
}

export * from './events'