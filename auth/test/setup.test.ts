import { prisma } from "../src/prisma-client"


beforeAll(async () => {
  if (process.env.DATABASE_URL !== 'postgresql://test:test@postgres:5432/auth')
    throw 'wrong testing DB'
})

beforeEach(async() => {
  await prisma.user.deleteMany()
  await prisma.journey.deleteMany()
})