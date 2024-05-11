import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export { prisma }

interface NewUser {
  email: string
  password: string
  name?: string
  avatar?: string
}

export async function createUser(attr: NewUser) {
  const user = await prisma.user.create({
    data: attr,
    include: {
      journeys: true
    }
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

export async function allUser() {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true
    }
  })
}

interface NewJourney {
  name: string
  subtitle: string | null
  picture: string | null
  members: {
    id: string
  }[]
}

export interface JourneyWithId extends NewJourney {
  id: string
}

export async function userJourneys(userId: string): Promise<{ id: string }[]> {
  return await prisma.journey.findMany({
    where: {
      members: {
        some: {
          id: userId
        }
      }
    }
  })
}

export async function createJourney(attr: NewJourney)
{
  const user = await prisma.user.findUnique({
    where: { id: attr.members[0].id }
  })
  if (!user) throw 'user-not-exist'

  return await prisma.journey.create({
    data: {
      name: attr.name,
      subtitle: attr.subtitle,
      picture: attr.picture,
      members: { connect: { id: user.id } }
    },
    include: { members: true }
  })
}

export async function putJourney(attr: JourneyWithId)
{
  const { id, name, subtitle, picture, members } = attr
  const journey = await prisma.journey.update({
    where: { id },
    data: {
      name,
      subtitle,
      picture,
      members: {
        set: [],
        connect: members
      }
    },
    include: {
      members: {
        select: {
          "id": true,
          "name": true,
          "avatar": true,
          "email": true,
        }
      }
    }
  })
  return journey
}

export async function addMember(attr: {
  id: string,
  members: { id: string }[]
}) {
  const { id, members } = attr
  const journey = await prisma.journey.update({
    where: { id },
    data: {
      members: {
        connect: members
      }
    },
    include: {
      members: {
        select: {
          "id": true,
          "name": true,
          "avatar": true,
          "email": true,
        }
      }
    }
  })
  return journey
}