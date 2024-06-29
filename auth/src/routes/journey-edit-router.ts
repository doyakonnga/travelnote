import express from 'express'
import { JourneyWithId, addMember, memberQuit, putJourney } from '../prisma-client'
import { JourneyPublisher } from '../events/publishers/journey-created-publisher'
import { redpanda } from '../common'


export const journeyEditRouter = express.Router()

journeyEditRouter.put('/', async (req, res) => {
  const { id, name, subtitle, picture, members }: JourneyWithId = req.body
  if (!req.user.journeyIds.includes(id)) throw 'unauthorized'

  const journey = await putJourney({ id, name, subtitle, picture, members })

  const producer = redpanda.producer
  const journeyProducer = new JourneyPublisher(producer)
  await journeyProducer.send(journey.id, {
    action: 'modified',
    journey
  })
  console.log(`event sent, journey-modified, id: ${journey.id}`)

  return res.status(200).json(journey)
})

journeyEditRouter.patch('/', async (req, res) => {
  const journeyId: string = req.body.id
  const quitingMemberId: string = req.body.quitingMemberId
  const journey = await memberQuit({ 
    id: journeyId, 
    memberId: quitingMemberId 
  })

  const producer = redpanda.producer
  const journeyProducer = new JourneyPublisher(producer)
  await journeyProducer.send(journey.id, {
    action: 'modified',
    journey
  })
  console.log(`event sent, journey-modified, id: ${journey.id}`)

  return res.status(200).json(journey)
})

journeyEditRouter.post('/', async (req, res) => {
  const id: string = req.body.id
  if (!req.user?.journeyIds.includes(id)) throw '401'
  const members: { id: string }[] = req.body.members
  const journey = await addMember({ id, members })

  const producer = redpanda.producer
  const journeyProducer = new JourneyPublisher(producer)
  await journeyProducer.send( journey.id, {
    action: 'modified',
    journey
  })
  console.log(`event sent, journey-modified, id: ${journey.id}`)

  return res.status(200).json(journey)
})