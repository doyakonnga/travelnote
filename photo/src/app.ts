import express from 'express'
import 'express-async-errors'
import cookieSession from 'cookie-session'
import { albumRouter } from './routes/album-router'
import { photoRouter } from './routes/photo-router'
import { reqUser, errorHandler, E } from '@dkprac/common'

export const app = express()
export const v = '/api/v1'

app.set('trust proxy', true)
app.use(express.json())
app.use(
  cookieSession({ signed: false }),
  reqUser, (req, res, next) => {
    if (!req.user) throw E[E['#401']]
    return next()
  }
)

app.use(`${v}/albums`, albumRouter)
app.use(`${v}/photos`, photoRouter)
app.all('*', (req, res) => { throw E[E['#404']] })

app.use(errorHandler)