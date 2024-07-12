import { prisma } from "../src/prisma-client"
import { setup } from "./function"

jest.mock('@dkprac/common', () => ({
  ...jest.requireActual('@dkprac/common'),
  redpanda: {
    producer: {
      send: jest.fn()
    }
  }
}))

beforeAll(async () => {
  if (process.env.DATABASE_URL !== 'postgresql://test:test@postgres:5432/photo') throw 'WRONG TEST DATABASE'

  // await Promise.all(
  //   (['photo', 'consumption', 'album', 'journey'] as const)
  //     .map(table => (prisma[table].deleteMany as any)({})))
  for (const table of ['photo', 'consumption', 'album', 'journey'] as const) {
    await (prisma[table].deleteMany as any)({})
  }
  await setup.create()
})