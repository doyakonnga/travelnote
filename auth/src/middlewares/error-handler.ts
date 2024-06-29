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

      case 'email in use':
        return res.status(400)
          .json([{ field: 'email', message: 'The email is in use.'}])
      case 'email not exist':
        return res.status(400)
          .json([{ field: 'email', message: 'User with this email has not been registered.' }])
      case 'password incorrect':
        return res.status(400)
          .json([{ field: 'password', message: 'Password Incorrect' }])

      case 'Journey title required':
        return res.status(400)
          .json([{ field: 'title', message: 'Journey title required' }])

      case 'express-validator errors':
        const result = validationResult(req).array().map((e) => {
          return { field: `${(e as any).location}.${(e as any).path}`, message: e.msg }
        })
        return res.status(400).json(result)
      
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