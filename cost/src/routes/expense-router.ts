import express from 'express'

import { userExpenses } from '../prisma-client'

export const expenseRouter = express.Router()

expenseRouter.get('/', async (req, res) => {
  const expenses = await userExpenses(
    req.user.id,
    req.query.journey as string
  )
  return res.status(200).json({ expenses })
})
