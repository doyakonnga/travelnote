import express from 'express'
import { createAlbum, deleteAlbumById, journeyAlbumById, moveAllphotos, updateAlbum } from '../prisma-client'
import { body } from 'express-validator'

export const albumRouter = express.Router()

albumRouter.get('/', async (req, res) => {
  const id = req.query.journeyId as string
  const albums = await journeyAlbumById(id)
  return res.status(200).json({ albums })
})

albumRouter.post('/',
  body('journeyId').isString(),
  body('name').isString(),
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

albumRouter.patch('/',
  body('id').isString(), 
  body('name').isString,
  async (req, res) => {
    const { id, name } : {
      id: string; name: string
    } = req.body
    const album = await updateAlbum({ id, name }) 
    return res.status(200).json({ album })
  }
)

albumRouter.delete('/',
  body('id').isString(),
  async (req, res) => {
    await moveAllphotos({
      originId: req.body.id, targetName: 'unclassified'
    })
    await deleteAlbumById(req.body.id)
    return res.status(200).json({ })
  }
)