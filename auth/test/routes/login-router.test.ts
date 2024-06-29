import request from "supertest"
import { prisma } from "../../src/prisma-client"
import { app, v } from "../../src/app"


describe('Route: /user/login', () => {

  beforeEach(async () => {
    await prisma.user.deleteMany({})
  })

  it('responds 400 if email not registered', async () => {
    const res = await request(app).post(`${v}/user/login`).send({
      email: 'testtest3@email.com',
      password: 'passwort'
    })
    expect(res.statusCode).toBe(400)
  })

  it('responds 400 if password incorrect', async () => {
    await request(app).post(`${v}/user/signup`).send({
      email: 'testtest4@email.com',
      password: 'password'
    })
    const res = await request(app).post(`${v}/user/login`).send({
      email: 'testtest4@email.com',
      password: 'passwordddd'
    })
    expect(res.statusCode).toBe(400)
  })

  it('responds 200 with cookie-jwt after successfully logging in', async () => {
    await request(app).post(`${v}/user/signup`).send({
      email: 'testtest5@email.com',
      password: 'password'
    })
    const res = await request(app).post(`${v}/user/login`).send({
      email: 'testtest5@email.com',
      password: 'password'
    })
    expect(res.statusCode).toBe(200)
    expect(res.get('Set-Cookie')).toBeDefined()
  })

})