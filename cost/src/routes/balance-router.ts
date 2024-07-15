import express, { Request, Response, NextFunction } from 'express'
import '../middlewares/req-user'
import { body, query, param, validationResult } from 'express-validator'
import { unpaidExpenses } from '../prisma-client'

export const balanceRouter = express.Router()

balanceRouter.get('/',
  query('journeyId').isString(),
  async (req, res) => {
    if (!validationResult(req).isEmpty())
      throw 'express-validator errors'
    const jId = req.query?.journeyId as string
    const expenses = await unpaidExpenses(jId)
    const balances: {
      domestic: { [key: string]: number },
      foreign: { [key: string]: number }
    } = { domestic: {}, foreign: {} }
    let numerator: number = 0
    let denominator: number = 0
    
    expenses.forEach((ex) => {
      const debtorId = ex.userId
      const b =
      ex.consumption.isForeign ? balances.foreign : balances.domestic
      // minus on debtor
      if (b[debtorId] === undefined) { b[debtorId] = -(ex.amount) }
      else { b[debtorId] -= ex.amount }
      // plus on creditor
      const creditorId = ex.consumption.payingUserId
      if (b[creditorId] === undefined) { b[creditorId] = ex.amount }
      else { b[creditorId] += ex.amount }
      // calculate default exchange rate
      if (ex.consumption.isForeign && ex.consumption.rate) {
        numerator += ex.amount * ex.consumption.rate
        denominator += ex.amount
      }
    })

    const defaultRate = Math.floor((numerator / denominator) * 1000) / 1000
    return res.status(200).json({ 
      balances, 
      defaultRate: defaultRate || 0 
    })

  }
)