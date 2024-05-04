import express from 'express'
import { JourneyWithId, addMember, putJourney } from '../prisma-client'

export const journeyEditRouter = express.Router()

journeyEditRouter.put('/', async (req, res) => {
  const { id, name, members }: JourneyWithId = req.body
  if (!req.user.journeyIds.includes(id)) throw 'unauthorized'

  const journey = await putJourney({ id, name, members })
  return res.status(200).json(journey)
})

journeyEditRouter.post('/', async (req, res) => {
  const id: string = req.body.id
  if (!req.user.journeyIds.includes(id)) throw 'unauthorized'

  const members: { id: string }[] = req.body.members
  const journey = await addMember({ id, members })
  return res.status(200).json(journey)
})