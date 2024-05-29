import { Request, Response, NextFunction } from "express"
import "./req-user"

export async function requireInJourney(
  req: Request, 
  res: Response,
  next: NextFunction
) {
  if (!req.user?.journeyIds) throw '401'

  let journeyId: string = ''
  if (typeof req.query?.journeyId === 'string')
    { journeyId = req.query.journeyId }
  else if (typeof req.body?.journeyId === 'string')
    { journeyId = req.body.journeyId }
  else { throw 'journeyId param not provided' }
   
  if (!req.user.journeyIds?.includes(journeyId))
    throw '401'
  else { return next() }
}