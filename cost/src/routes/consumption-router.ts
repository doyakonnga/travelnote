import express, { NextFunction, Request, Response } from 'express'
import { body, param, validationResult } from 'express-validator'
import '../middlewares/req-user'
import { createConsumption, areUsersInJourney, journeyConsumptions, updateConsumption, deleteConsumptionById, consumptionById } from '../prisma-client'
import connectRedpanda from '../redpanda'
import { ConsumptionPublisher } from '../events/publishers/consumption-publisher'
import { validation } from '../middlewares/validation-result'

export const consumptionRouter = express.Router()


consumptionRouter.get('/', async (req, res) => {
  const journeyId = req.query.journeyId as string
  const consumptions = await journeyConsumptions(journeyId)
  res.status(200).json({ consumptions })
})

consumptionRouter.get('/:id',
  param("id").isString(),
  validation, 
  async (req, res) => {
  const id: string = req.params.id
  const consumption = await consumptionById(id)
  return res.status(200).json({ consumption })
})

consumptionRouter.delete('/:id',
  param("id").isString(),
  validation,
  async (req, res) => {
    const consumption = await deleteConsumptionById(req.params!.id)

    const [producer,] = await connectRedpanda
    await (new ConsumptionPublisher(producer))
      .send(consumption.id, { action: 'deleted', consumption })

    return res.status(200).json({ consumption })
  }
)

consumptionRouter.use(
  body('journeyId').isString(),
  body('name').isString(),
  body('isForeign').default(false).isBoolean(),
  // rate of 0 will be saved as null in DB
  body('rate').default(0).custom((rate) => {
    if (typeof rate !== 'number' || rate < 0) 
      throw new Error('rate has to be positive number')
    return true
  }),
  // default current user is paying user
  (req, res, next) => {
    body('payingUserId').default(req.user?.id).isString()(req, res, next)
  },
  body('expenses').custom(expenses => {
    expenses.forEach((e: { userId: string, amount: number }) => {
      if (typeof e.userId !== 'string')
        throw new Error('userId has to be string')
      if (typeof e.amount !== 'number' || e.amount < 0)
        throw new Error('amount has to be positive number')
      // error thrown here will be caught by express-validator
      // and e.message will appear in validationResult(req).array().[{msg}]
    })
    return true
  }),
  // validate if each user is in the journey group
  async (req, res, next) => {
    if (!(await areUsersInJourney(
      req.body.expenses.map((e: { userId: string }) => e.userId as string),
      req.body.journeyId as string
    ))) throw 'not all users in the journey'
    return next()
  }
)


consumptionRouter.post('/',
  validation,
  async (req: Request, res: Response) => {
    const consumption = await createConsumption(req.body)

    const [producer,] = await connectRedpanda
    await (new ConsumptionPublisher(producer))
      .send(consumption.id, { action: 'created', consumption })

    res.status(200).json({ consumption })
  }
)

consumptionRouter.put('/:id',
  param("id").isString(),
  validation,
  async (req, res) => {
    const consumption = await updateConsumption({
      id: req.params.id,
      ...req.body
    })

    const [producer,] = await connectRedpanda
    await (new ConsumptionPublisher(producer))
      .send(consumption.id, { action: 'modified', consumption })

    res.status(200).json({ consumption })
  })

