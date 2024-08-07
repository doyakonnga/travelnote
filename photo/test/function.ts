import { app, v } from "../src/app"
import request from 'supertest'
import { prisma } from "../src/prisma-client"
import jsonwebtoken from 'jsonwebtoken'

export const newCookies = (info?: {
  id: string
  journeyIds: string[]
}) => {
  if (!process.env.JWT_KEY) throw 'NO ENV: JWT_KEY'
  const payload = info || {
    id: crypto.randomUUID(),
    journeyIds: []
  }
  const jwt = jsonwebtoken.sign(payload, process.env.JWT_KEY)
  const sess = { jwt }
  return [
    `session=${Buffer.from(JSON.stringify(sess)).toString('base64')}`
  ]
}

class Setup {

  public userId = crypto.randomUUID()
  public journeyId = crypto.randomUUID()
  public consumptionId = crypto.randomUUID()
  public albumId = crypto.randomUUID()
  // get albumId() {
  //   if (!this._albumId) throw 'album not established'
  //   return this._albumId
  // }
  public cookies: string[]

  constructor() {
    this.cookies = newCookies({
      id: this.userId,
      journeyIds: [this.journeyId]
    })
  }

  create = async () =>
    // create journey
    await prisma.journey.create({
      data: {
        id: this.journeyId,
        memberIds: [this.userId],
        // create album
        albums: {
          create: {
            id: this.albumId,
            name: 'unclassified',
            userId: this.userId,
          }
        },
        // create consumption
        consumptions: {
          create: { id: this.consumptionId }
        }
      }
    })

}

export const setup = new Setup()

export const resetTestAlbums = async () => {
  await prisma.album.deleteMany({
    where: {
      name: { not: 'unclassified' }
    }
  })
  // POST: /albums
  const res = await request(app).post(`${v}/albums`)
    .set('Cookie', setup.cookies)
    .send({
      journeyId: setup.journeyId,
      name: 'to-test-patch'
    }).expect(201)
  return res.body.album.id
}