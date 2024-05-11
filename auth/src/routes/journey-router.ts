import express from 'express'
import { createJourney, userJourneys } from '../prisma-client'
import jsonwebtoken from 'jsonwebtoken'


export const journeyRouter = express.Router()

journeyRouter.get('/', async (req, res) => {
  if (!req.user?.id)
    return res.status(200).json([])

  const journeys = await userJourneys(req.user.id)
  return res.status(200).json(journeys)
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
