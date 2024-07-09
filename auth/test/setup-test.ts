import { prisma } from "../src/prisma-client";

jest.mock('@dkprac/common', () => ({
  ...jest.requireActual('@dkprac/common'),
  redpanda: {
    producer: {
      send: jest.fn()
      // .mockImplementation(
      //   (topic: string, messages: { key: string; value: string }[]) => {})
    }
  }
}))


beforeAll(async () => {
  if (process.env.DATABASE_URL !== 'postgresql://test:test@postgres:5432/auth')
    throw 'wrong testing DB'
})

