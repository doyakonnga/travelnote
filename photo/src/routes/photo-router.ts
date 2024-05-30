import express from 'express'
import { albumPhotoById, consumptionPhotoById, createPhoto } from '../prisma-client'
import { body } from 'express-validator'

export const photoRouter = express.Router()

photoRouter.get("/", async (req, res) => {
  const photos =
    (typeof req.query.consumptionId === 'string') ?
      await consumptionPhotoById(req.query.consumptionId)
      : (typeof req.query.albumId === 'string') ?
        await albumPhotoById(req.query.albumId)
        : null
  if (!photos) throw 'scope not specified'
  return res.status(200).json({ photos })
})


photoRouter.post('/',
  body('url').isString(),
  body('description').default('').isString(),
  body('userId').isString(),
  body('albumId').isString(),
  body('consumptionId').default('').isString(),
  async (req, res) => {
    const data: {
      url: string
      description: string
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

