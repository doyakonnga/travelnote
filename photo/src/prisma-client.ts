import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
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

export async function deleteConsumptionById(id: string) {
  return await prisma.consumption.delete({ where: { id } })
}

export async function journeyAlbumById(id: string) {
  return await prisma.album.findMany({
    where: { journeyId: id },
    include: {
      photos: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })
}

export async function getAlbumById(id: string) {
  return await prisma.album.findUnique({
    where: { id },
    include: {
      photos: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })
}

export async function createAlbum({ name, userId, journeyId }: {
  name: string
  userId: string
  journeyId: string
}) {
  try {
    return await prisma.album.create({
      data: {
        name, userId, journeyId
      }
    })
  } catch(e) {
    if (e instanceof PrismaClientKnownRequestError)
      if (e.code === 'P2002')
        throw 'unique constraint violation'
    throw e
  }
}

export async function updateAlbum({ id, name }: {
  id: string
  name: string
}) {
  return await prisma.album.update({
    where: { id },
    data: { name },
    include: { photos: true }
  })
}

export async function moveAllphotos(props: {
  originId: string
  targetName: string
}) {
  const album = await prisma.album.findFirst({
    where: {
      journey: {
        albums: {
          some: { id: props.originId }
        }
      },
      name: props.targetName
    }
  })
  if (!album) throw '404'
  return await prisma.photo.updateMany({
    where: {
      albumId: props.originId
    },
    data: {
      albumId: album.id
    }
  })
}

export async function deleteAlbumById(id: string) {
  return await prisma.album.delete({
    where: { id },
    include: { photos: true }
  })
}

export async function consumptionPhotoById(id: string) {
  return await prisma.photo.findMany({
    where: { consumptionId: id },
    include: { album: true }
  })
}

export async function albumPhotoById(id: string) {
  return await prisma.photo.findMany({
    where: { albumId: id },
    include: { album: true }
  })
}

export async function journeyPhotoById(id: string) {
  return await prisma.photo.findMany({
    where: {
      album: { journeyId: id }
    },
    include: { album: true }
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
    },
    include: { album: true }
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
  return await prisma.photo.delete({ where: { id } })
}