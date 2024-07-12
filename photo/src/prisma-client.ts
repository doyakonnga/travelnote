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
        switch (e.code) {
          case 'P2025':
            console.log('prisma not found')
            throw E[E['#404']]
          case 'P2002':
            throw E[E['unique constraint violation']]
          case 'P2003':
            throw E[E['FK constraint failed']]
        }
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
  return await prisma.album.create({
    data: {
      name, userId, journeyId
    }
  })
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

export const deleteAlbumById = catchingWrapper(async (id: string) => {
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
export const createPhoto = catchingWrapper(
  async (attrs: photoInit) => {
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
  })

export const createMultiplePhoto = catchingWrapper(
  async ({ userId, albumId, urls }: {
    userId: string;
    albumId: string;
    urls: string[]
  }) => {
    return await prisma.photo.createMany({
      data: urls.map(url => {
        return { userId, url, albumId }
      })
    })
    // const album = await prisma.album.update({
    //   where: {
    //     id: albumId,
    //     journeyId: { in: ['user.journeyIds'] }
    //   },
    //   data: {
    //     photos: {
    //       createMany: { data: urls.map(url => ({ userId, url, albumId })) }
    //     }
    //   },
    //   select: {
    //     photos: true
    //   }
    // })
    // return album.photos
  })

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


export const deletePhotoById = catchingWrapper(
  async (id: string, userId: string) =>
    await prisma.photo.delete({ where: { id, userId } }))

export const deletePhotoByIds = catchingWrapper(
  async (ids: string[], userId: string) =>
    await prisma.photo.deleteMany({ where: { id: { in: ids }, userId } }))


