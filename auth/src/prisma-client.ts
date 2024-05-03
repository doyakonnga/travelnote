import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export { prisma }

interface User {
  email: string
  password: string
  name?: string
}

export async function createUser(attr: User) {
  const user = await prisma.user.create({
    data: attr,
    select: { id: true, email: true, name: true }
  })
  return user
}

export async function findUser(attr: { email: string }) {
  const user = await prisma.user.findUnique({
    where: attr,
    include: {
      journeys: true
    }
  })
  return user
}

interface Journey {
  name: string
  members: {
    id: string,
    email?: string,
    name?: string,
    avatar?: string
  }[]
}

export async function findJourneys() {
  return await prisma.journey.findMany()
}

export async function createJourney(attr: Journey) {
  const user = await prisma.user.findUnique({
    where: { id: attr.members[0].id }
  })
  if (!user) throw 'user-not-exist'

  return await prisma.journey.create({
    data: {
      name: attr.name,
      members: {
        connect: { id: user.id }
      }
    },
    include: { members: true }
  })
}