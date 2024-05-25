import express, { NextFunction, Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import '../middlewares/req-user'
import { createConsumption, areUsersInJourney, journeyConsumptions, updateConsumption } from '../prisma-client'

export const consumptionRouter = express.Router()


consumptionRouter.get('/', async (req, res) => {
  const journeyId = req.query.journeyId as string
  const consumptions = await journeyConsumptions(journeyId)
  res.status(200).json({ consumptions })
})


consumptionRouter.use(
  body('journeyId').isString(),
  body('name').isString(),
  body('isForeign').default(false).isBoolean(),
  body('rate').default(0).isNumeric(),
  (req: Request, res: Response, next: NextFunction) => {
    body('payingUserId').default(req.user?.id).isString()(req, res, next)
  },
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
  }),
  async (req, res, next) => {
    
    return next()
  },
  // validate if each user is in the journey group
  async (req, res, next) => {
    if (!(await areUsersInJourney(
      req.body.expenses.map((e: { userId: string }) => e.userId as string),
      req.body.journeyId as string
    ))) throw 'not all users in the journey'
    return next()
  }
)


consumptionRouter.post('/', async (req: Request, res: Response) => {
  if (!validationResult(req).isEmpty()) {
    console.log(validationResult(req))
    throw 'express-validator errors'
  }
  const consumption = await createConsumption(req.body)
  res.status(200).json({ consumption })
})

consumptionRouter.put('/', 
body("id").isString(),
async (req, res) => {
  if (!validationResult(req).isEmpty()) {
    console.log(validationResult(req))
    throw 'express-validator errors'
  }
  const consumption = await updateConsumption(req.body)
  res.status(200).json({ consumption })
})