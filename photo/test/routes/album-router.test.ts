import { app, v } from "../../src/app"
import { prisma } from "../../src/prisma-client"
import request from 'supertest'
import { resetTestAlbums, setup } from "../function"

beforeAll(async () => {
  await prisma.photo.deleteMany({})
})

describe('GET: /albums', () => {

  const SUT = (query?: string) =>
    request(app).get(`${v}/albums${query || ''}`)

  it('responds 400 if not specifying journeyId', async () => {
    const res = await SUT().set('Cookie', setup.cookies)
    expect(res.statusCode).toBe(400)
  })

  it('responds 401 without setting cookie', async () => {
    const res = await SUT(`?journeyId=${setup.journeyId}`)
    expect(res.statusCode).toBe(401)
  })

  it('responds 200 with valid cookie and journeyId in param',
    async () => {
      const res = await SUT(`?journeyId=${setup.journeyId}`)
        .set('Cookie', setup.cookies)
      expect(res.statusCode).toBe(200)
    }
  )
})

describe('POST: /albums', () => {

  const SUT = () => request(app).post(`${v}/albums`)

  beforeEach(async () => {
    await prisma.album.deleteMany({
      where: {
        name: { not: 'unclassified' }
      }
    })
  })

  it('respnds 400 without valid body.name', async () => {
    const res = await SUT()
      .set('Cookie', setup.cookies)
      .send({ name: '', journeyId: setup.journeyId })
    expect(res.statusCode).toBe(400)
  })

  it('respnds 401 with valid cookie', async () => {
    const res = await SUT()
      .send({ name: 'new', journeyId: setup.journeyId })
    expect(res.statusCode).toBe(401)
  })

  it('responds 201 with valid cookie and params',
    async () => {
      const res = await SUT()
        .set('Cookie', setup.cookies)
        .send({ name: 'expected', journeyId: setup.journeyId })
      expect(res.statusCode).toBe(201)
      expect(res.body.album.name).toBe('expected')
    }
  )
})

describe('PATCH: /albums', () => {

  let newAlbumId: string = ''
  beforeEach(async () => {
    newAlbumId = await resetTestAlbums()
  })

  const SUT = (param?: string) =>
    request(app).patch(`${v}/albums${param || ''}`)

  xit('responds 400 if not providing params.id', async () => {
    const res = await SUT()
      .set('Cookie', setup.cookies)
      .send({ name: 'akai kouenn' })
    expect(res.statusCode).toBe(400)
  })

  it('responds 400 if invalid body.name', async () => {
    const res = await SUT(`/${newAlbumId}`)
      .set('Cookie', setup.cookies)
      .send({ name: '' })
    expect(res.statusCode).toBe(400)
  })

  it('responds 401 if invalid cookie', async () => {
    const res = await SUT(`/${newAlbumId}`)
      .send({ name: 'asakura' })
    expect(res.statusCode).toBe(401)
  })

  it('responds 404 if album not-found by params.id', async () => {
    const res = await SUT(`/${crypto.randomUUID()}`)
      .set('Cookie', setup.cookies)
      .send({ name: 'scandal' })
    expect(res.statusCode).toBe(404)
  })

  it('responds 200 with valid cookie, params and body', async () => {
    const res = await SUT(`/${newAlbumId}`)
      .set('Cookie', setup.cookies)
      .send({ name: 'scandal' })
    expect(res.statusCode).toBe(200)
  })
})


describe('DELETE: /albums', () => {

  const SUT = (param?: string) =>
    request(app).delete(`${v}/albums${param || ''}`)

  let newAlbumId: string = ''
  beforeEach(async () => {
    newAlbumId = await resetTestAlbums()
  })

  it('responds 401 if invalid cookie', async () => {
    const res = await SUT(`/${newAlbumId}`)
    expect(res.statusCode).toBe(401)
  })

  it('responds 404 if album not-found by params.id', async () => {
    const res = await SUT(`/${crypto.randomUUID()}`)
      .set('Cookie', setup.cookies)
    expect(res.statusCode).toBe(404)
  })

  it('responds 200 with valid cookie and params', async () => {
    const res = await SUT(`/${newAlbumId}`)
      .set('Cookie', setup.cookies)
    expect(res.statusCode).toBe(200)
    // GET: /albums?journeyId=
    const res2 = await request(app)
      .get(`${v}/albums?journeyId=${setup.journeyId}`)
      .set('Cookie', setup.cookies)
    expect(res2.body.albums.length).toBe(1)
  })
})
