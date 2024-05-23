import express from 'express'
import { JourneyWithId, addMember, putJourney } from '../prisma-client'
import { JourneyPublisher } from '../events/publishers/journey-created-publisher'
import connectRedpanda from '../redpanda'


export const journeyEditRouter = express.Router()

journeyEditRouter.put('/', async (req, res) => {
  const { id, name, subtitle, picture, members }: JourneyWithId = req.body
  if (!req.user.journeyIds.includes(id)) throw 'unauthorized'

  const journey = await putJourney({ id, name, subtitle, picture, members })
  return res.status(200).json(journey)
})

journeyEditRouter.post('/', async (req, res) => {
  const id: string = req.body.id
  if (!req.user?.journeyIds.includes(id)) throw 'unauthorized'
  const members: { id: string }[] = req.body.members
  const journey = await addMember({ id, members })

  const [producer,] = await connectRedpanda
  const journeyProducer = new JourneyPublisher(producer)
  await journeyProducer.send( journey.id, {
    action: 'modified',
    journey
  })
  console.log(`event sent, journey-modified, id: ${journey.id}`)

  return res.status(200).json(journey)
})