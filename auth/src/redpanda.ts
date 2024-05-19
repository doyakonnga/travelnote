import { Kafka, CompressionTypes } from "kafkajs"

const redpanda = new Kafka({
  brokers: [process.env.REDPANDA_BROKER!],
  ssl: {},
  sasl: {
    mechanism: "scram-sha-256",
    username: process.env.REDPANDA_USERNAME!,
    password: process.env.REDPANDA_PASSWORD!
  }
})


async function connectRedpanda() {
  const producer = redpanda.producer()
  const consumer = redpanda.consumer({ groupId: 'auth' })
  await producer.connect()
  await consumer.connect()
  return [producer, consumer]
}

export default connectRedpanda()