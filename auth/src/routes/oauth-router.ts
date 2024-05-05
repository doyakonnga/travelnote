import express from 'express'
import axios from 'axios'
import querystring from 'node:querystring'
import jsonwebtoken from 'jsonwebtoken'
import { randomBytes } from 'crypto'
import { createUser, findUser } from '../prisma-client'

export const oauthRouter = express.Router()

oauthRouter.get('/', async (req, res) => {
  if (req.query.code) throw 'no-authorization-code'

  try {
    const gRes: { data: { access_token: string } } = await axios.post(
      'https://oauth2.googleapis.com/token',
      querystring.stringify({
        code: req.query.code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: 'http://localhost:4000/user/oauth',
        grant_type: 'authorization_code'
      }), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })

    const token = gRes.data.access_token
    const resource = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    const email: string = resource.data.email
    const name: string = resource.data.name
    const picture: string = resource.data.picture
    const password = randomBytes(20).toString('ascii')

    const foundUser = await findUser({ email })
    const user = foundUser ? foundUser 
      : await createUser({ email, name, avatar: picture, password }) 
    

    const journeyIds = user.journeys.map((j) => j.id)
    const userToken: Express.UserToken = {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      journeyIds
    }
    const jwt = jsonwebtoken.sign(userToken, process.env.JWT_KEY!)
    req.session = { jwt }


    return res.redirect('http://localhost:3000/')

  } catch (e: any) {
    console.log('////////// GOOGLE OAUTH ERROR /////////////////////////////////')
    console.log(e)
  }

})