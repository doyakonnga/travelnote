import request from "supertest"
import { prisma } from "../../src/prisma-client"
import { app, v } from "../../src/app"


beforeEach(async () => {
  await prisma.user.deleteMany({})
  jest.clearAllMocks()
})
afterAll(async () => {
  await prisma.user.deleteMany({})
  jest.clearAllMocks()
})

describe('GET: /user', () => {

  it('responds 200 with users', async () => {
    const res1 = await request(app).get(`${v}/user`)
    expect(res1.statusCode).toBe(200)
    expect(res1.body.users).toEqual([])
    await request(app).post(`${v}/users/signup`).send({
      email: 'testtest7@email.com',
      password: 'password'
    })
    const res2 = await request(app).get(`${v}/user`)
    expect(res2.statusCode).toBe(200)
    expect(res2.body.users[0].email).toContain('testtest')
  })

  it('responds 200 with query string of email to search a user', async () => {
    await request(app).post(`${v}/users/signup`).send({
      email: 'testtest8@email.com',
      password: 'password'
    })
    const res = await request(app).get(`${v}/user?email=testtest8@email.com`)
    expect(res.statusCode).toBe(200)
    expect(res.body.user.email).toBe('testtest8@email.com')
  })
})

describe('GET: /users/currentuser', () => {

  it('responds 200 with {user: null} if not logging in', async () => {
    const res = await request(app).get(`${v}/users/currentuser`)
    expect(res.statusCode).toBe(200)
    expect(res.body.user).toBeNull()
  })

  it('responds 200 with current user info', async () => {
    await request(app).post(`${v}/users/signup`).send({
      email: 'testtest9@email.com',
      password: 'password'
    })
    const res0 = await request(app).post(`${v}/users/login`).send({
      email: 'testtest9@email.com',
      password: 'password'
    })
    let cookie = res0.get('Set-Cookie')
    expect(cookie).toBeDefined()
    cookie = cookie || []
    const res = await request(app).get(`${v}/users/currentuser`)
      .set("Cookie", cookie)
    expect(res.statusCode).toBe(200)
    expect(res.body.user.email).toBe('testtest9@email.com')
  })

})

describe('GET: /users/:id', () => {

  it('responds 200 with corrensponding user info', async () => {
    const res1 = await request(app).post(`${v}/users/signup`).send({
      email: 'testtest8@email.com',
      password: 'password'
    })
    const id: string = res1.body.user.id
    const res2 = await request(app).get(`${v}/users/${id}`)
    expect(res2.statusCode).toBe(200)
    expect(res2.body.user.email).toBe(res1.body.user.email)
  })
})