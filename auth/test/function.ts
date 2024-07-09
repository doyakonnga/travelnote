import request from "supertest"
import { app, v } from "../src/app"


export const login = async () => {
  const n = Math.floor(Math.random() * 10000).toString()
  const res0 = await request(app).post(`${v}/user/signup`).send({
    email: `testtest${n}@email.com`,
    password: 'password'
  })
  const email = res0.body.user.email
  const res = await request(app).post(`${v}/user/login`).send({
    email,
    password: 'password'
  }).expect(200)
  return {
    cookie: res.get('Set-Cookie') || [],
    body: res.body
  }

}