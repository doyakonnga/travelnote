import { Kafka, CompressionTypes, Producer, Consumer } from "kafkajs"

const redpandaConfig = new Kafka({
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
  private _producer: Producer | null = null
  private _consumer: Consumer | null = null
  public connect = async (groupId: string) => {
    this._producer = redpandaConfig.producer()
    this._consumer = redpandaConfig.consumer({ groupId })
    await this._producer.connect()
    await this._consumer.connect()
    return [this._producer, this._consumer] as const
  }
  get producer() {
    if (!this._producer) throw new Error('not connected to redpanda')
    return this._producer
  }
  get consumer() {
    if (!this._consumer) throw new Error('not connected to redpanda')
    return this._consumer
  }
}

export const redpanda = new Redpanda()