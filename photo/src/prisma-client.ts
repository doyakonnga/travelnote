import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { E } from "@dkprac/common";
export const prisma = new PrismaClient()

function catchingWrapper<T extends any[], U>(f: (...arg: T) => Promise<U>) {
  return async (...arg: T) => {
    try {
      return await f(...arg)
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') throw E[E['#404']]
      }
      throw e
    }
  }
}

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
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError)
      if (e.code === 'P2002')
        throw 'unique constraint violation'
    throw e
  }
}

export const updateAlbum = catchingWrapper(async ({ id, name, journeyIds }: {
  id: string; name: string; journeyIds: string[]
}) => {
  return await prisma.album.update({
    where: { id, journeyId: { in: journeyIds } },
    data: { name },
    include: { photos: true }
  })
})

export async function albumAccessible(albumId: string, journeyIds: string[]) {
  return !!await prisma.album.findUnique({
    where: {
      id: albumId, journeyId: { in: journeyIds }
    }
  })
}

export const movePhotos = catchingWrapper(async (props: {
  albumId: string
  photoIds: string[]
  journeyIds: string[]
}) => {
  return await prisma.photo.updateMany({
    where: {
      id: { in: props.photoIds },
      album: { journeyId: { in: props.journeyIds } }
    },
    data: { albumId: props.albumId }
  })
})

export const moveAllphotos = catchingWrapper(async (props: {
  originId: string
  targetName: string
  journeyIds: string[]
}) => {
  const album = await prisma.album.findFirst({
    where: {
      journey: {
        id: { in: props.journeyIds },
        albums: {
          some: { id: props.originId }
        }
      },
      name: props.targetName
    }
  })
  if (!album) throw E[E['#404']]
  return await prisma.photo.updateMany({
    where: {
      albumId: props.originId
    },
    data: {
      albumId: album.id
    }
  })
})

export const deleteAlbumById = catchingWrapper(async(id: string) => {
  return await prisma.album.delete({
    where: { id },
    include: { photos: true }
  })
})

export async function consumptionPhotoById(id: string) {
  return await prisma.photo.findMany({
    where: {
      consumptionId: id
    },
    include: { album: true },
    orderBy: { createdAt: 'desc' }
  })
}

export async function albumPhotoById(id: string) {
  return await prisma.photo.findMany({
    where: {
      albumId: id
    },
    include: { album: true },
    orderBy: { createdAt: 'desc' }
  })
}

export async function journeyPhotoById(id: string) {
  return await prisma.photo.findMany({
    where: {
      album: { journeyId: id }
    },
    include: { album: true },
    orderBy: { createdAt: 'desc' }
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

export async function createMultiplePhoto({ userId, albumId, urls }: {
  userId: string; albumId: string; urls: string[]
}) {
  return await prisma.photo.createMany({
    data: urls.map(url => {
      return { userId, url, albumId }
    })
  })
}

export const updatePhoto = catchingWrapper(async (attrs: {
  id: string
  description?: string
  albumId?: string
  consumptionId?: string
}) => {
  const { description, albumId, consumptionId } = attrs
  return await prisma.photo.update({
    where: { id: attrs.id },
    data: { description, albumId, consumptionId }
  })
})

export async function deletePhotoById(id: string, userId: string): Promise<{
  id: string;
  url: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  albumId: string;
  consumptionId: string | null;
}>
export async function deletePhotoById(id: string[], userId: string): Promise<Prisma.BatchPayload>
export async function deletePhotoById(id: string | string[], userId: string) {
  if (typeof id === 'string')
    return await prisma.photo.delete({ where: { id, userId } })
  else
    return await prisma.photo.deleteMany({ where: { id: { in: id }, userId } })
}

