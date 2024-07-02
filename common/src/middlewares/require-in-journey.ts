import { Request, Response, NextFunction } from "express"
import "./req-user"
import { E } from "./errors"

export async function requireInJourney(
  req: Request, 
  res: Response,
  next: NextFunction
) {
  if (!req.user?.journeyIds) throw E[E['#401']]

  let journeyId: string = ''
  if (typeof req.query?.journeyId === 'string')
    { journeyId = req.query.journeyId }
  else if (typeof req.body?.journeyId === 'string')
    { journeyId = req.body.journeyId }
  else { throw E[E['journeyId param not provided']] }
   
  if (!req.user.journeyIds?.includes(journeyId))
    throw E[E['#401']]
  else { return next() }
}