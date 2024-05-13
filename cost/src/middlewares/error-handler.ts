import { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"

export const errorHandler = (
  err: string | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (typeof err === 'string') {
    console.log('into errorHandlerMiddleware')
    console.log(err)
    switch (err) {

      case 'email not exist':
        return res.status(400)
          .json([{ field: 'email', message: 'User with this email has not been signed.' }])
      case 'password incorrect':
        return res.status(400)
          .json([{ field: 'password', message: 'Password Incorrect' }])

      case 'Journey title required':
        return res.status(400)
          .json([{ field: 'title', message: 'Journey title required' }])

      case 'journeyId param not provided':
        return res.status(400)
          .json([{ field: 'journeyId', message: 'journeyId not provided in query or body' }])
      case 'express-validator errors':
        const result = validationResult(req).array().map((e) => {
          return { field: `${(e as any).location}.${(e as any).path}`, message: e.msg }
        })
        return res.status(400).json(result)
      case 'not all users in the journey':
        return res.status(400)
          .json([{ field: 'expenses.userId', message: 'not all users are in the journey' }])

      case '401':
        return res.status(401)
          .json([{ field: 'user or journey', message: 'unauthorized' }])
      case '404':
        return res.status(404)
          .json([{ field: 'route', message: 'the route is undefined' }])
    }
  } else {
    res.status(500).json([{ field: 'unspecific', message: 'uncatched errors happened' }])
  }
}