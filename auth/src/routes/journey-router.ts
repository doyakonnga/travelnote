import express from 'express'
import { createJourney, findJourney, userJourneys } from '../prisma-client'

export const journeyRouter = express.Router()

journeyRouter.get('/', async (req, res) => {
  if (!req.user?.id)
    return res.status(200).json([])

  const journeys = await userJourneys(req.user.id)
  return res.status(200).json(journeys)
})

journeyRouter.get('/:id', async (req, res) => {
  const journey = await findJourney(req.params.id)
  if (!journey) throw '404'
  if (!journey.members.some((m) => m.id === req.user.id))
    throw '401'
  res.status(200).json({ journey })
})

journeyRouter.post('/', async (req, res) => {
  const name = req.body.name
  if (!name) throw 'Journey title required'
  const subtitle = req.body.subtitle || null
  const picture = req.body.picture || null
  const journey = await createJourney({
    name,
    subtitle,
    picture,
    members: [{ id: req.user.id }]
  })
  
  return res.status(200).json(journey)
})
