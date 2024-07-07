import express from 'express'
import { createJourney, findJourney, JourneyWithId, patchJourney, userJourneys } from '../prisma-client'
import { E, redpanda, validation } from '@dkprac/common'
import { JourneyPublisher } from '../events/publishers/journey-created-publisher'
import { body, param } from 'express-validator'

export const journeyRouter = express.Router()

journeyRouter.get('/:id', async (req, res) => {
  const journey = await findJourney(req.params.id)
  if (!journey) throw E[E['#404']]
  if (!journey.members.some((m) => m.id === req.user.id))
    throw E[E['#401']]
  res.status(200).json({ journey })
})

journeyRouter.get('/', async (req, res) => {
  if (!req.user?.id)
    return res.status(200).json([])

  const journeys = await userJourneys(req.user.id)
  return res.status(200).json(journeys)
})

journeyRouter.post('/', async (req, res) => {
  const name = req.body.name
  if (!name) throw E[E['Journey title required']]
  const subtitle = req.body.subtitle || null
  const picture = req.body.picture || null
  const journey = await createJourney({
    name,
    subtitle,
    picture,
    members: [{ id: req.user.id }]
  })

  const producer = redpanda.producer
  const journeyProducer = new JourneyPublisher(producer)
  journeyProducer.send(journey.id, {
    action: 'created',
    journey
  })

  return res.status(200).json(journey)
})

const equelNullorisString = (field: any) => {
  if (field == null || typeof field === 'string')
    return true
  throw new Error('must be null, undefined or string')
}
const isUndefinedOrString = (field: any) => {
  if (field === undefined || typeof field === 'string')
    return true
  throw new Error('must be null, undefined or string')
}

journeyRouter.patch('/:id',
  param('id').isString(),
  body('name').custom(isUndefinedOrString),
  ...['subtitle', 'picture'].map(field => 
    body(field).custom(equelNullorisString)),
  validation,
  async (req, res) => {
    const { id } = req.params
    const { name, subtitle, picture }: JourneyWithId = req.body
    if (!req.user.journeyIds.includes(id))
      throw E[E['#401']]
    const journey = await patchJourney({ id, name, subtitle, picture })
    return res.status(200).json({ journey })
  })
