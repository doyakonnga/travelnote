
jest.mock('@dkprac/common', () => ({
  ...jest.requireActual('@dkprac/common'),
  redpanda: {
    producer: {
      send: jest.fn()
    }
  }
}))

beforeAll(() => {
  if (process.env.DATABASE_URL !== 'postgresql://test:test@postgres:5432/photo') throw 'WRONG TEST DATABASE'
})