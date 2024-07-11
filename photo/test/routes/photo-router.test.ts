
import request from 'supertest'
import { app, v } from '../../src/app'
import { prisma } from '../../src/prisma-client'
import { setup } from '../function'


describe('GET: /photos', () => {

  const SUT = (query?: string) =>
    request(app).get(`${v}/photos${query || ''}`)

  beforeEach(async () => {
    await prisma.photo.deleteMany({})
  })

  it('responds 400 if scope not specified', async () => {
    const res = await SUT()
      .set('Cookie', setup.cookies)
    expect(res.statusCode).toBe(400)
  })
})

describe('POST: /photos', () => {

  const SUT = () =>
    request(app).post(`${v}/photos`)

  beforeEach(async () => {
    await prisma.photo.deleteMany({})
  })

  it('responds 400 with invaild req.body', async () => {
    const res = await SUT()
      .set('Cookie', setup.cookies)
      .send({})
    expect(res.statusCode).toBe(400)
  })

})