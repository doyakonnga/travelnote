import express, { Request, Response, NextFunction } from 'express'
import jsonwebtoken from 'jsonwebtoken'


declare global {
  namespace Express {
    interface UserToken {
      id: string
      email: string
      name?: string
      avatar?: string
      journeyIds: string[]
    }
    interface Request {
      user: UserToken
    }
  }
}

export const reqUser = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as any).session?.jwt) return next()
  req.user = jsonwebtoken.verify(
    (req as any).session.jwt,
    process.env.JWT_KEY!) as Express.UserToken
  return next()
}