import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import { createConsumption, areUsersInJourney, journeyConsumptions } from '../prisma-client'

export const consumptionRouter = express.Router()


consumptionRouter.get('/', async (req, res) => {
  const journeyId = req.query.journeyId as string
  const consumptions = await journeyConsumptions(journeyId)
  res.status(200).json({ consumptions })
})

consumptionRouter.post('/', [
  body('journeyId').isString(),
  body('isForeign').default(true).isBoolean(),
  body('rate').default(0).isNumeric(),
  body('payingUserId').isString(),
  body('expenses').custom(expenses => {
    expenses.forEach((e: { userId: string, amount: number }) => {
        if (typeof e.userId !== 'string')
          throw new Error('userId has to be string')
        if (typeof e.amount !== 'number')
          throw new Error('amount has to be number')
        return 0
      // error thrown here will be caught by express-validator
      // and appear in validationResult(req).array().[{msg}]
    })
    return true
  })
], async (req: Request, res: Response) => {
  if (!validationResult(req).isEmpty()) {
    console.log(validationResult(req))
    throw 'express-validator errors'
  }
  if (!(await areUsersInJourney(
    req.body.expenses.map((e: { userId: string }) => e.userId as string),
    req.body.journeyId as string
  ))) throw 'not all users in the journey'
  const consumption = await createConsumption(req.body)
  res.status(200).json({ consumption })
})