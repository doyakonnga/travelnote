import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient()

export async function createJourney(journey: {
  id: string; members: { id: string }[]
}) {
  return await prisma.journey.create({
    data: {
      id: journey.id,
      memberIds: journey.members.map((m) => m.id)
    }
  })
}

export async function modifyJourney(journey: {
  id: string; members: { id: string }[]
}) {
  return await prisma.journey.update({
    where: { id: journey.id },
    data: {
      memberIds: journey.members.map((m) => m.id)
    }
  })
}

export async function createConsumption(c: {
  id: string; journeyId: string
}) {
  return await prisma.consumption.create({
    data: {
      id: c.id,
      journeyId: c.journeyId
    }
  })
}

export async function deleteConsumption({ id }: { id: string }) {
  return await prisma.consumption.delete({ where: { id } })
}

export async function journeyAlbumById(id: string) {
  return await prisma.album.findMany({
    where: { journeyId: id }
  })
}

export async function createAlbum({ name, userId, journeyId }: {
  name: string
  userId: string
  journeyId: string
}) {
  return await prisma.album.create({
    data: {
      name, userId, journeyId
    }
  })
}

export async function consumptionPhotoById(id: string) {
  return await prisma.photo.findMany({
    where: { consumptionId: id }
  })
}

export async function albumPhotoById(id: string) {
  return await prisma.photo.findMany({
    where: { albumId: id }
  })
}

interface photoInit {
  url: string
  description?: string
  userId: string
  albumId: string
  consumptionId?: string
}
export async function createPhoto(attrs: photoInit) {
  return await prisma.photo.create({
    data: {
      url: attrs.url,
      description: attrs.description,
      userId: attrs.userId,
      albumId: attrs.albumId,
      consumptionId: attrs.consumptionId
    }
  })
}

export async function updatePhoto(attrs: {
  id: string
  description: string
  albumId?: string
  consumptionId?: string
}) {
  const { description, albumId, consumptionId } = attrs
  return await prisma.photo.update({
    where: { id: attrs.id },
    data: { description, albumId, consumptionId }
  })
}

export async function deletePhotoById(id: string) {
  return await prisma.photo.delete({ where: { id }})
}