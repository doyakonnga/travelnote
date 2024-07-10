import request from 'supertest'
import { prisma } from "../../src/prisma-client"
import { login } from "../function"
import { app, v } from '../../src/app'
import { redpanda } from '@dkprac/common'

// User1
let cookie: string[] = []
let id: string = ''
// User2
let cookie2: string[] = []
let id2: string = ''
beforeAll(async () => {
  await prisma.user.deleteMany({})
  await prisma.journey.deleteMany({});
  ({
    cookie: cookie,
    body: { user: { id: id } }
  } = await login());
  ({
    cookie: cookie2,
    body: { user: { id: id2 } }
  } = await login())
})

// Create a journey by User1
let journeyId = ''
let newCookie: string[] = []
beforeEach(async () => {
  jest.clearAllMocks()
  await prisma.journey.deleteMany({})
  // POST: /journey
  const res0 = await request(app)
    .post(`${v}/journey`).set('Cookie', cookie)
    .send({ name: 'new' })
  journeyId = res0.body.journey.id
  // GET RenewToken
  const res1 = await request(app)
    .get(`${v}/user/renewtoken`).set('Cookie', cookie)
  newCookie = res1.get('Set-Cookie') || []
})


describe('POST: /journeys/members', () => {

  const SUT = () => request(app).post(`${v}/journeys/members`)

  it('responds 401 with invalid cookie', async () => {
    const res = await SUT()
      .set('Cookie', cookie2)
      .send({ journeyId, members: [id2] })
    expect(res.statusCode).toBe(401)
  })

  it('responds 400 without valid body.members or body.journeyId', async () => {
    const res1 = await SUT()
      .set('Cookie', newCookie)
      .send({ journeyId, members: id2 })
    expect(res1.statusCode).toBe(400)

    const res2 = await request(app)
      .post(`${v}/journeys/members`).set('Cookie', newCookie)
      .send({ members: [id2] })
    expect(res2.statusCode).toBe(400)
  })

  it('responds 200 with valid cookie and params', async () => {
    const res = await SUT()
      .set('Cookie', newCookie)
      .send({ journeyId, members: [id2] })
    expect(res.statusCode).toBe(200)
    expect(res.body.journey.members.length).toBe(2)
  })

  it('produces event (function has been called)', async () => {
    await SUT()
      .set('Cookie', newCookie)
      .send({ journeyId, members: [id2] })
    expect(redpanda.producer.send).toHaveBeenCalled()
  })
})

describe('PATCH: /journeys/members', () => {

  const SUT = () => request(app).patch(`${v}/journeys/members`)

  it('responds 401 with invalid cookie', async () => {
    const res = await SUT()
      .set('Cookie', cookie2)
      .send({ journeyId })
    expect(res.statusCode).toBe(401)
  })

  it('responds 400 with invalid body params', async () => {
    const res = await SUT()
      .set('Cookie', newCookie)
      .send({})
    expect(res.statusCode).toBe(400)
  })

  it('responds 200 with valid cookie', async () => {
    const res = await SUT()
      .set('Cookie', newCookie)
      .send({ journeyId })
    expect(res.statusCode).toBe(200)
    expect(res.body.journey.members.length).toBe(0)
  })

  it('produces event (function has been called)', async () => {
    await SUT()
      .set('Cookie', newCookie)
      .send({ journeyId })
    expect(redpanda.producer.send).toHaveBeenCalled()
  })
})