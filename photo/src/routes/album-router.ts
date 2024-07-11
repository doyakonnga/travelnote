import express from 'express'
import { createAlbum, deleteAlbumById, getAlbumById, journeyAlbumById, moveAllphotos, updateAlbum } from '../prisma-client'
import { body, param } from 'express-validator'
import { validation, requireInJourney, E } from '@dkprac/common'
export const albumRouter = express.Router()

albumRouter.get('/',
  requireInJourney,
  async (req, res) => {
    const id = req.query.journeyId as string
    const albums = await journeyAlbumById(id)
    return res.status(200).json({ albums })
  })

albumRouter.get('/:id',
  param('id').isString(),
  validation,
  async (req, res) => {
    const id: string = req.params.id
    const { id: uId, journeyIds } = req.user
    const album = await getAlbumById(id)
    if (!album) throw E[E['#404']]
    if (!journeyIds.includes(album.journeyId))
      throw E[E['#401']]
    return res.status(200).json({ album })
  })

albumRouter.post('/',
  requireInJourney,
  body('journeyId').notEmpty().isString(),
  body('name').notEmpty().isString(),
  validation,
  async (req, res) => {
    const journeyId: string = req.body.journeyId
    if (!req.user?.journeyIds.includes(journeyId)) 
      throw E[E['#401']]
    const album = await createAlbum({
      name: req.body.name,
      journeyId,
      userId: req.user.id
    })
    return res.status(201).json({ album })
  }
)

albumRouter.patch('/:id',
  param('id').notEmpty().isString(),
  body('name').notEmpty().isString(),
  validation,
  async (req, res) => {
    const id: string = req.params.id
    const name: string = req.body.name
    const {journeyIds} = req.user
    const album = await updateAlbum({ id, name, journeyIds })
    return res.status(200).json({ album })
  }
)

albumRouter.delete('/:id',
  param('id').notEmpty().isString(),
  validation,
  async (req, res) => {
    await moveAllphotos({
      originId: req.params.id, 
      targetName: 'unclassified',
      journeyIds: req.user.journeyIds
    })
    const album = await deleteAlbumById(req.params.id)
    return res.status(200).json({ album })
  }
)