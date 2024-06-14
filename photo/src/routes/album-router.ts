import express from 'express'
import { createAlbum, deleteAlbumById, journeyAlbumById, moveAllphotos, updateAlbum } from '../prisma-client'
import { body, param } from 'express-validator'
import { validation } from '../middlewares/validation-result'

export const albumRouter = express.Router()

albumRouter.get('/', async (req, res) => {
  const id = req.query.journeyId as string
  const albums = await journeyAlbumById(id)
  return res.status(200).json({ albums })
})

albumRouter.post('/',
  body('journeyId').isString(),
  body('name').isString(),
  validation,
  async (req, res) => {
    if (!req.user?.id) throw '401'
    const album = await createAlbum({
      name: req.body.name,
      journeyId: req.body.journeyId,
      userId: req.user.id
    })
    return res.status(200).json({ album })
  }
)

albumRouter.patch('/:id',
  param('id').isString(), 
  body('name').isString(),
  validation,
  async (req, res) => {
    const id: string = req.params.id
    const name: string = req.body.name
    const album = await updateAlbum({ id, name }) 
    return res.status(200).json({ album })
  }
)

albumRouter.delete('/:id',
  param('id').isString(),
  validation,
  async (req, res) => {
    await moveAllphotos({
      originId: req.params.id, targetName: 'unclassified'
    })
    await deleteAlbumById(req.params.id)
    return res.status(200).json({ })
  }
)