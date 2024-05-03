import express from 'express'
import { createJourney, findJourneys } from '../prisma-client'


export const journeyRouter = express.Router()

journeyRouter.get('/', async (req, res) => {
  const journeys = await findJourneys()
  return res.status(200).json(journeys)
})

journeyRouter.post('/', async (req, res) => {
  const { name } = req.body
  const journey = await createJourney({
    name,
    members: [{ id: req.user.id }]
  })
  return res.status(200).json(journey)
})

declare global {
  type a = number
}