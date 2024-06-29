
jest.mock('../src/common', () => ({
  ...jest.requireActual('../src/common'),
  redpanda: {
    producer: {
      send: (topic: string, messages: { key: string; value: string }[]) => {
        console.log(`Topic: ${topic}`, '\n', `Messages: ${messages}`)
      }
    }
  }
}))


beforeAll(async () => {
  if (process.env.DATABASE_URL !== 'postgresql://test:test@postgres:5432/auth')
    throw 'wrong testing DB'
})