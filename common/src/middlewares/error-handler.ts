import { Request, Response, NextFunction } from "express"
import { validationResult } from "express-validator"
import { E } from "./errors"

export const errorHandler = (
  err: string | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (typeof err === 'string' && Object.keys(E).includes(err)) {
    console.log('into errorHandlerMiddleware')
    console.log(err)
    switch (err) {
      // auth field
      case E[E['email in use']]:
        return res.status(400)
          .json([{ field: 'email', message: 'The email is in use.' }])
      case E[E['email not exist']]:
        return res.status(400)
          .json([{ field: 'email', message: 'User with this email has not been signed.' }])
      case E[E['password incorrect']]:
        return res.status(400)
          .json([{ field: 'password', message: 'Password Incorrect' }])

      // joureny
      case E[E['Journey title required']]:
        return res.status(400)
          .json([{ field: 'title', message: 'Journey title required' }])
      case E[E['scope not specified']]:
        return res.status(400)
          .json([{ field: 'query', message: 'scope not specified'}])
      case E[E['journeyId param not provided']]:
        return res.status(400)
          .json([{ field: 'journeyId', message: 'journeyId not provided in query or body' }])

      // express validator
      case E[E['express-validator errors']]:
        const result = validationResult(req).array().map((e) => {
          return { field: `${(e as any).location}.${(e as any).path}`, message: e.msg }
        })
        return res.status(400).json(result)
      case E[E['not all users in the journey']]:
        return res.status(400)
          .json([{ field: 'expenses.userId', message: 'not all users are in the journey' }])
      
      // prisma error
      case E[E['unique constraint violation']]:
        return res.status(400)
          .json([{ field: 'unspecified', message: 'unique constraint violation, some field might need an unique value' }])
      case E[E['FK constraint failed']]:
        return res.status(404)
          .json([{ field: 'unspecified', message: 'FK constraint failed, some field representing FK has no corresponding record.' }])
      
      // simple error
      case E[E['#401']]:
        return res.status(401)
          .json([{ field: 'user or journey', message: 'unauthorized' }])
      case E[E['#404']]:
        return res.status(404)
          .json([{ field: 'route', message: 'the route is undefined' }])
    }
  } else {
    console.log(err)
    res.status(500).json([{ field: 'unspecific', message: 'uncatched errors happened' }])
  }
}