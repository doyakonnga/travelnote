import express from 'express'
import { body, validationResult } from 'express-validator'
import { journeyConsumptions } from '../prisma-client'

export const consumptionRouter = express.Router()

interface ExpenAttr {
  userId: string
  amount: number
}

interface ConsAttr {
  journeyId: string
  isForegin: boolean
  rate: number
  payingUserId: string
  expenses: ExpenAttr[]
}

consumptionRouter.get('/', async (req, res) => {
  const journeyId = req.query.journeyId as string
  const consumptions = await journeyConsumptions(journeyId)
  res.status(200).json({ consumptions })
})

consumptionRouter.post('/', [
  body('journeyId').isString(),
  body('isForegin').default(true).isBoolean(),
  body('rate').default(0).isNumeric(),
  body('payingUserId').isString(),
  body('expenses').custom(expenses =>
    typeof expenses.userId === 'string' &&
    typeof expenses.amount === 'number'
  )
], async (req, res) => {
  if (!validationResult(req).isEmpty())
    throw 'body attribute incomplete'
  const attrs = req.body as ConsAttr
})