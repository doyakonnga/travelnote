import request from 'supertest'
import { app, v } from '../../src/app'

it('responds 400 with invalid email or password', async() => {
  const res = await request(app).post(`${v}/user/signup`).send({
    email: '',
    password: ''
  })
  expect(res.statusCode).toBe(400)
})

it('responds 201 with legal email and password', async() => {
  const res = await request(app).post(`${v}/user/signup`).send({
    email: 'testtest@email.com',
    password: 'password'
  })
  expect(res.statusCode).toBe(201)
})

it('responds 400 with registered email', async () => {
  const res = await request(app).post(`${v}/user/signup`).send({
    email: 'testtest@email.com',
    password: 'password'
  })
  const res2 = await request(app).post(`${v}/user/signup`).send({
    email: 'testtest@email.com',
    password: 'password'
  })
  expect(res2.statusCode).toBe(400)
})

