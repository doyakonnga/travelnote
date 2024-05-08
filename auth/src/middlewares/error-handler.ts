import { Request, Response, NextFunction } from "express"

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

      case '404':
        return res.status(404)
          .json([{ field: 'route', message: 'the route is undefined on auth server' }])
    }
  } else {
    res.status(500).json([{ field: 'unspecific', message: 'uncatched errors happened' }])
  }
}