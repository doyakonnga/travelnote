import express from 'express'
import { JourneyWithId, addMember, memberQuit } from '../prisma-client'
import { JourneyPublisher } from '../events/publishers/journey-created-publisher'
import { E, redpanda, requireInJourney, validation } from '@dkprac/common'
import { body } from 'express-validator'

export const journeyMemberRouter = express.Router()

const isArrayOfString = (field: any) => {
  if (Array.isArray(field)) return false
  for (const m of field) {
    if (typeof m !== 'string') return false
  }
  return true
}

journeyMemberRouter.use(
  requireInJourney,
  body('journeyId').isString(),
)

journeyMemberRouter.post('/',
  body('members').custom(isArrayOfString)
    .withMessage('body.members must be string[]'),
  validation,
  async (req, res) => {
    const id: string = req.body.journeyId
    const members: { id: string }[] = req.body.members
    const journey = await addMember({ id, members })

    const producer = redpanda.producer
    const journeyProducer = new JourneyPublisher(producer)
    await journeyProducer.send(journey.id, {
      action: 'modified',
      journey
    })
    console.log(`event sent, journey-modified, id: ${journey.id}`)

    return res.status(200).json(journey)
  })

journeyMemberRouter.patch('/',
  body('quitingMemberId').default('').isString(),
  async (req, res) => {
    const journeyId: string = req.body.journeyId
    const quitingMemberId: string = req.body.quitingMemberId || req.user.id
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

