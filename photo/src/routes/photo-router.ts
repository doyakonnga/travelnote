import express from 'express'
import { albumPhotoById, consumptionPhotoById, createMultiplePhoto, createPhoto, deletePhotoById, journeyPhotoById, movePhotos } from '../prisma-client'
import { body, param, query } from 'express-validator'
import { validation } from '../middlewares/validation-result'

export const photoRouter = express.Router()

photoRouter.get("/", async (req, res) => {
  const photos =
    (typeof req.query.consumptionId === 'string') ?
      await consumptionPhotoById(req.query.consumptionId)
      : (typeof req.query.albumId === 'string') ?
        await albumPhotoById(req.query.albumId)
        : (typeof req.query.journeyId === 'string') ?
          await journeyPhotoById(req.query.journeyId)
          : null
  if (!photos) throw 'scope not specified'
  return res.status(200).json({ photos })
})


photoRouter.post('/',
  body('url').isString(),
  body('description').default('').isString(),
  (req, res, next) => {
    body('userId').default(req.user?.id).isString()(req, res, next)
  },
  body('albumId').isString(),
  body('consumptionId').default('').isString(),
  validation,
  async (req, res) => {
    const data: {
      url: string
      description: string | null
      userId: string
      albumId: string
      consumptionId: string
    } = req.body
    const photo = await createPhoto({
      url: data.url,
      description: data.description || undefined,
      userId: data.userId,
      albumId: data.albumId,
      consumptionId: data.consumptionId || undefined
    })
    return res.status(200).json({ photo })
  }
)

photoRouter.post('/multiple',
  (req, res, next) => {
    body('userId').default(req.user?.id).isString()(req, res, next)
  },
  body('albumId').isString(),
  body('urls').custom((urls) => {
    if (!Array.isArray(urls))
      throw new Error('urls must be array')
    urls.forEach((url) => {
      if (typeof url !== 'string')
        throw new Error('urls must be array')
    })
    return true
  }),
  validation,
  async (req, res) => {
    const { userId, albumId, urls }: {
      userId: string
      albumId: string
      urls: string[]
    } = req.body
    const { count } = await createMultiplePhoto({
      userId, albumId, urls
    })
    res.status(200).json({ count })
  }
)

photoRouter.patch('/',
  body('albumId').isString(),
  body('photoIds').custom((photoIds: any) => {
    if (!Array.isArray(photoIds))
      throw new Error('photosIds must be array')
    photoIds.forEach((id) => {
      if (typeof id !== 'string')
        throw new Error('photosIds must be array of string')
    })
    return true
  }),
  validation,
  async (req, res) => {
    const albumId: string = req.body.albumId
    const photoIds: string[] = req.body.photoIds
    res.status(200).json(await movePhotos({ albumId, photoIds }))
  }
)

photoRouter.delete('/:id',
  param('id').isString(),
  async (req, res) => {
    const photo = await deletePhotoById(req.params!.id)
    return res.status(200).json({ photo })
  }
)

photoRouter.delete('/',
  query('ids').custom((ids: any) => {
    if (!Array.isArray(ids))
      throw new Error('photosIds must be array')
    ids.forEach((id) => {
      if (typeof id !== 'string')
        throw new Error('photosIds must be array of string')
    })
    return true
  }),
  validation,
  async (req, res) => {
    const ids: string[] = req.query.ids as string[]
    const { count } = await deletePhotoById(ids)
    res.status(200).json({ count })
  }
)