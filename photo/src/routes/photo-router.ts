import express from 'express'
import { albumAccessible, albumPhotoById, consumptionPhotoById, createMultiplePhoto, createPhoto, deletePhotoById, journeyPhotoById, movePhotos, updatePhoto } from '../prisma-client'
import { body, param, query } from 'express-validator'
import { validation, E } from '@dkprac/common'

export const photoRouter = express.Router()

photoRouter.get("/", async (req, res) => {
  const { id: uId, journeyIds } = req.user
  const roughPhotos =
    (typeof req.query.consumptionId === 'string') ?
      await consumptionPhotoById(req.query.consumptionId)
      : (typeof req.query.albumId === 'string') ?
        await albumPhotoById(req.query.albumId)
        : (typeof req.query.journeyId === 'string') ?
          await journeyPhotoById(req.query.journeyId)
          : null
  if (!roughPhotos) throw E[E['scope not specified']]
  if (roughPhotos[0] && !journeyIds.includes(roughPhotos[0].album.journeyId)) 
    throw E[E['#401']]
  const photos = roughPhotos.map(p => {return {...p, editable: p.userId === uId}})
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
    if (!await albumAccessible(data.albumId, req.user.journeyIds))
      throw E[E['#404']]
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
    if (!await albumAccessible(albumId, req.user.journeyIds))
      throw E[E['#404']]
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
    const {journeyIds} = req.user
    const albumId: string = req.body.albumId
    const photoIds: string[] = req.body.photoIds
    const { count } = await movePhotos({ albumId, photoIds, journeyIds })
    res.status(200).json({ count })
  }
)

photoRouter.patch('/:id', 
  param('id').isString(),
  body('description').default('').isString(),
  body('albumId').default('').isString(),
  body('consumptionId').default('').isString(),
  async (req, res) => {
    const photo = await updatePhoto({
      id: req.params!.id as string,
      description: req.body.description || undefined,
      albumId: req.body.albumId || undefined,
      consumptionId: req.body.consumptionId || undefined,
    })
    res.status(200).json({ photo })
})

photoRouter.delete('/:id',
  param('id').isString(),
  async (req, res) => {
    const photo = await deletePhotoById(req.params!.id, req.user.id)
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
    const ids = req.query.ids as string[]
    const { count } = await deletePhotoById(ids, req.user.id)
    res.status(200).json({ count })
  }
)