import { Kafka, CompressionTypes } from "kafkajs"

const redpanda = new Kafka({
  brokers: [process.env.REDPANDA_BROKER!],
  connectionTimeout: 200000,
  ssl: {},
  sasl: {
    mechanism: "scram-sha-256",
    username: process.env.REDPANDA_USERNAME!,
    password: process.env.REDPANDA_PASSWORD!
  }
})

class Redpanda {
  connect = async (groupId: string) => {
    const producer = redpanda.producer()
    const consumer = redpanda.consumer({ groupId })
    await producer.connect()
    await consumer.connect()
    // await consumer.subscribe({
    //   topic: "test",
    //   fromBeginning: true
    // })
    // console.log('subscribed')
    // await consumer.run({
    //   autoCommit: false,
    //   eachMessage: async ({ topic, partition, message }: { topic: string, partition: number, message: any }) => {
    //     const topicInfo = `topic: ${topic} (${partition}|${message.offset})`
    //     const messageInfo = `key: ${message.key}, value: ${message.value}`
    //     await consumer.commitOffsets([{
    //       topic,
    //       partition,
    //       offset: (Number(message.offset + 1)).toString()
    //     }]);
    //     console.log(`Message consumed: ${topicInfo}, ${messageInfo}`)
    //   },
    // })
    return [producer, consumer] as const
  }
}

// export const producer = redpanda.producer()
// export const consumer = redpanda.consumer({ groupId: 'auth' })


export default (new Redpanda).connect('auth')