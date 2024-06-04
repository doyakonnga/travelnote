import express from 'express'
import { albumPhotoById, consumptionPhotoById, createPhoto, deletePhotoById, journeyPhotoById } from '../prisma-client'
import { body, param } from 'express-validator'
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

photoRouter.delete('/:id',
  param('id').isString(),
  async (req, res) => {
    await deletePhotoById(req.params!.id)
    return res.status(200).json({ })
  }
)