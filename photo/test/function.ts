import { app, v } from "../src/app"
import request from 'supertest'
import { prisma } from "../src/prisma-client"
import jsonwebtoken from 'jsonwebtoken'

class Setup {

  public userId = crypto.randomUUID()
  public journeyId = crypto.randomUUID()
  public consumptionId = crypto.randomUUID()
  private albumId = crypto.randomUUID()
  // get albumId() {
  //   if (!this._albumId) throw 'album not established'
  //   return this._albumId
  // }
  public cookies: string[]
  
  constructor() {
    const payload = {
      id: this.userId,
      journeyIds: [this.journeyId]
    }
    if (!process.env.JWT_KEY) throw 'NO ENV: JWT_KEY'
    const jwt = jsonwebtoken.sign(payload, process.env.JWT_KEY)
    const sess = { jwt }
    this.cookies = [
      `session=${Buffer.from(JSON.stringify(sess)).toString('base64')}`
    ]
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