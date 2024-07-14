import express, { Request, Response, NextFunction } from 'express'
import '../middlewares/req-user'
import { body, param, validationResult } from 'express-validator'
import { ExpenseQuery, updateExpense, userExpenses } from '../prisma-client'

export const expenseRouter = express.Router()

expenseRouter.get('/', async (req, res) => {
  const expenses = await userExpenses(
    req.user.id,
    req.query.journey as string
  )
  return res.status(200).json({ expenses })
})

expenseRouter.put("/:expenseId", [
  body('isPaid').isBoolean(),
  body('description').isString(),
  body('amount').isNumeric()
], async (req: Request, res: Response) => {

  return res.status(200).json({})
})

expenseRouter.patch("/:expenseId",
  param('expenseId').notEmpty(),
  body('isPaid').if(body('isPaid')).isBoolean({ strict: true }),
  body('description').if(body('description').notEmpty()).isString(),
  body('amount').if(body('amount').notEmpty()).custom((a) => {
    if (typeof a !== 'number') throw new Error('amount must be number')
  }),
  async (req: Request, res: Response) => {
    if (!validationResult(req).isEmpty())
      throw 'express-validator errors'
    let query: ExpenseQuery = { id: req.params.expenseId }
    const { isPaid, description, amount } = req.body
    query = { ...query, isPaid, description, amount }
    const result = await updateExpense(query)
    return res.status(200).json({ result })
  })