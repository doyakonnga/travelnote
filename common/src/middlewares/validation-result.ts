import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export function validation(
  req: Request,
  res: Response,
  next: NextFunction) {
  if (!validationResult(req).isEmpty()) {
    console.log(validationResult(req))
    throw 'express-validator errors'
  }
  return next()
}