import express from 'express'
import { allUser } from '../prisma-client'

export const allUserRouter = express.Router()

allUserRouter.get('/', async (req, res) => {
  res.status(200).json(await allUser())
})