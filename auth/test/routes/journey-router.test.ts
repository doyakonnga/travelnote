import request from "supertest"
import { prisma } from "../../src/prisma-client"
import { app, v } from "../../src/app"
import { login } from "../function"
import { redpanda } from "@dkprac/common"


beforeEach(async () => {
  await prisma.journey.deleteMany({})
  jest.clearAllMocks()
})

let cookie: string[] = []
let id = ''
beforeAll(async () => {
  await prisma.user.deleteMany({})
  const res = await login()
  cookie = res.cookie
  id = res.body.user.id
})


describe('GET: /journey', () => {
  it('responds 200 with journeys of the user', async () => {
    const name = Math.floor(Math.random() * 1000).toString()
    // POST
    await request(app).post(`${v}/journey`)
      .set('Cookie', cookie).send({ name })
    // GET
    const res = await request(app)
      .get(`${v}/journey`).set('Cookie', cookie)
    expect(res.statusCode).toBe(200)
    expect(res.body.journeys[0].name).toBe(name)
  })
})

describe('POST: /journey', () => {

  it('responds 400 without sending a journey name', async () => {
    const res = await request(app)
      .post(`${v}/journey`).set('Cookie', cookie).send({})
    expect(res.statusCode).toBe(400)
  })

  it('responds 401 without valid user cookie', async () => {
    const res = await request(app)
      .post(`${v}/journey`).set('Cookie', []).send({ name: 'new' })
    expect(res.statusCode).toBe(401)
  })

  it('responds 201 with valid cookie and body.name', async () => {
    const name = Math.floor(Math.random() * 1000).toString()
    const res = await request(app)
      .post(`${v}/journey`).set('Cookie', cookie)
      .send({ name })
    expect(res.statusCode).toBe(201)
    expect(res.body.journey.name).toBe(name)
  })

  it('produces event (function has been called)', async () => {
    await request(app)
      .post(`${v}/journey`).set('Cookie', cookie)
      .send({ name: 'new' })
    expect(redpanda.producer.send).toHaveBeenCalled()
  })
})

describe('PATCH: /journey', () => {

  it('reponds 401 if user not in journey', async () => {
    // POST
    const res0 = await request(app).post(`${v}/journey`)
      .set('Cookie', cookie).send({ name: 'test' })
    const { id } = res0.body.journey
    // PATCH by the second user
    const { cookie: cookie2 } = await login()
    const res = await request(app).patch(`${v}/journey/${id}`)
      .set('Cookie', cookie2).send({ name: 'test2' })
    expect(res.statusCode).toBe(401)
  })

  xit('reponds 400 without valid journey id', async () => {
    // POST
    await request(app).post(`${v}/journey`)
      .set('Cookie', cookie).send({ name: 'test' })
    // PATCH
    const res = await request(app).patch(`${v}/journey/`)
      .set('Cookie', cookie).send({ name: 'test2' })
    expect(res.statusCode).toBe(400)
  })

  it('reponds 200 valid user and journey id', async () => {
    // POST
    const res0 = await request(app).post(`${v}/journey`)
      .set('Cookie', cookie).send({ name: 'test' })
    const { id } = res0.body.journey
    // GET RenewToken
    const res1 = await request(app)
      .get(`${v}/user/renewtoken`).set('Cookie', cookie)
    const newCookie = res1.get('Set-Cookie') || []
    // PATCH
    const res = await request(app).patch(`${v}/journey/${id}`)
      .set('Cookie', newCookie).send({ name: 'test2' })
    expect(res.statusCode).toBe(200)
    expect(res.body.journey.name).toBe('test2')
  })
})