import express from 'express'
import { createJourney, userJourneys } from '../prisma-client'
import jsonwebtoken from 'jsonwebtoken'


export const journeyRouter = express.Router()

journeyRouter.get('/', async (req, res) => {
  const journeys = await userJourneys(req.user.id)

  // renew JWT
  req.user.journeyIds = journeys.map((j) => j.id)
  const jwt = jsonwebtoken.sign(req.user, process.env.JWT_KEY!)
  req.session = { jwt }

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
