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
    return [producer, consumer] as const
  }
}


export default (new Redpanda).connect('cost')