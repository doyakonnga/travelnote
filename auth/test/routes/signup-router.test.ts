import request from 'supertest'
import { app, v } from '../../src/app'
import { prisma } from '../../src/prisma-client'


describe('Route: /users/signup', () => {

  beforeEach(async () => {
    await prisma.user.deleteMany({})
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await prisma.user.deleteMany({})
    jest.clearAllMocks()
  })

  it('responds 400 with invalid email or password', async () => {
    const res = await request(app).post(`${v}/users/signup`).send({
      email: '',
      password: ''
    })
    expect(res.statusCode).toBe(400)
  })

  it('responds 201 with legal email and password', async () => {
    const res = await request(app).post(`${v}/users/signup`).send({
      email: 'testtest@email.com',
      password: 'password'
    })
    expect(res.statusCode).toBe(201)
  })

  it('responds 400 with registered email', async () => {
    const res = await request(app).post(`${v}/users/signup`).send({
      email: 'testtest2@email.com',
      password: 'password'
    })
    const res2 = await request(app).post(`${v}/users/signup`).send({
      email: 'testtest2@email.com',
      password: 'password'
    })
    expect(res2.statusCode).toBe(400)
  })

})
