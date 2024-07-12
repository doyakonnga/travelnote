
import request from 'supertest'
import { app, v } from '../../src/app'
import { prisma } from '../../src/prisma-client'
import { newCookies, setup } from '../function'


beforeEach(async () => {
  await prisma.photo.deleteMany({})
})


describe('GET: /photos', () => {

  const SUT = (query?: string) =>
    request(app).get(`${v}/photos${query || ''}`)

  beforeEach(async () => {
    // POST: /photos
    await Promise.all([
      request(app).post(`${v}/photos`).send({
        url: 'www.picture0.com',
        albumId: setup.albumId
      }).set('Cookie', setup.cookies)
        .expect(201),
      request(app).post(`${v}/photos`).send({
        url: 'www.picture1.com',
        albumId: setup.albumId,
        consumptionId: setup.consumptionId
      }).set('Cookie', setup.cookies)
        .expect(201)
    ])
  })

  it('responds 400 if scope not specified', async () => {
    const res = await SUT()
      .set('Cookie', setup.cookies)
    expect(res.statusCode).toBe(400)
  })

  it('responds 401 if providing invalid cookie', async () => {
    const res = await SUT(`?journeyId=${setup.journeyId}`)
    expect(res.statusCode).toBe(401)
  })

  it('responds 200 with valid cookie and query', async () => {
    const res1 = await SUT(`?journeyId=${setup.journeyId}`)
      .set('Cookie', setup.cookies)
    expect(res1.statusCode).toBe(200)
    expect(res1.body.photos.length).toBe(2)
    const res2 = await SUT(`?consumptionId=${setup.consumptionId}`)
      .set('Cookie', setup.cookies)
    expect(res2.statusCode).toBe(200)
    expect(res2.body.photos.length).toBe(1)
  })
})


describe('POST: /photos', () => {

  const SUT = () =>
    request(app).post(`${v}/photos`)

  it('responds 400 if providing invaild req.body', async () => {
    const res = await SUT()
      .set('Cookie', setup.cookies)
      .send({ url: 'www.picture.com', })
    expect(res.statusCode).toBe(400)
  })

  it('responds 401 if no valid cookie', async () => {
    const res = await SUT()
      .send({
        url: 'www.picture.com',
        albumId: setup.albumId
      })
    expect(res.statusCode).toBe(401)
  })

  it('responds 404 if album or consumption not found', async () => {
    const res = await SUT()
      .send({
        url: 'www.picture.com',
        albumId: setup.albumId,
        consumptionId: crypto.randomUUID()
      })
      .set('Cookie', setup.cookies)
    expect(res.statusCode).toBe(404)
  })

  it('responds 201 to req with valid cookie and body', async () => {
    const res = await SUT()
      .send({
        url: 'www.picture.com',
        albumId: setup.albumId,
        consumptionId: setup.consumptionId
      })
      .set('Cookie', setup.cookies)
    expect(res.statusCode).toBe(201)
  })
})


describe('POST: /photos/multiple', () => {

  const SUT = () =>
    request(app).post(`${v}/photos/multiple`)

  it('responds 400 if sending invalid body', async () => {
    const res = await SUT()
      .send({
        urls: ['www.picture.com', 'www.picture2.com'],
        albumId: '',
      }).set('Cookie', setup.cookies)
    expect(res.statusCode).toBe(400)
  })

  it('responds 401 if cookie not provided', async () => {
    const res = await SUT()
      .send({
        urls: ['www.picture.com', 'www.picture2.com'],
        albumId: setup.albumId,
      })
    expect(res.statusCode).toBe(401)
  })

  it('responds 404 if cookie invalid', async () => {
    const res = await SUT()
      .send({
        urls: ['www.picture.com', 'www.picture2.com'],
        albumId: setup.albumId,
      })
      .set('Cookie', newCookies())
    expect(res.statusCode).toBe(404)
  })

  it('responds 201 to req with valid cookie and body', async () => {
    const res = await SUT()
      .send({
        urls: ['www.picture.com', 'www.picture2.com'],
        albumId: setup.albumId,
      })
      .set('Cookie', setup.cookies)
    expect(res.statusCode).toBe(201)
  })
})


describe('PATCH: /photos', () => {

  let testAlbumId = ''
  let testPhotoId = ''
  beforeEach(async () => {
    await prisma.album.deleteMany({
      where: {
        name: { not: 'unclassified' }
      }
    })
    await Promise.all([
      // POST: /albums
      request(app).post(`${v}/albums`)
        .set('Cookie', setup.cookies)
        .send({ name: 'test', journeyId: setup.journeyId })
        .expect(201)
        .then(res => testAlbumId = res.body.album.id),
      // POST: /photos/multiple
      request(app).post(`${v}/photos`)
        .set('Cookie', setup.cookies)
        .send({ url: 'www.picture.com', albumId: setup.albumId, })
        .expect(201)
        .then(res => testPhotoId = res.body.photo.id)
    ])
  })

  const SUT = () =>
    request(app).patch(`${v}/photos`)

  it('responds 400 if sending invalid body', async () => {
    const res = await SUT()
      .set('Cookie', setup.cookies)
      .send({ albumId: testAlbumId, photoIds: testPhotoId })
    expect(res.statusCode).toBe(400)
  })

  it('responds 401 if cookie not provided', async () => {
    const res = await SUT()
      .send({ albumId: testAlbumId, photoIds: [testPhotoId] })
    expect(res.statusCode).toBe(401)
  })

  it('responds 404 if album not found', async () => {
    const res = await SUT()
      .set('Cookie', setup.cookies)
      .send({ albumId: crypto.randomUUID(), photoIds: [testPhotoId] })
    expect(res.statusCode).toBe(404)
  })

  it('responds 200 if cookie and body valid', async () => {
    const res = await SUT()
      .set('Cookie', setup.cookies)
      .send({ albumId: testAlbumId, photoIds: [testPhotoId] })
    expect(res.statusCode).toBe(200)
  })
})


describe('PATCH: /photos/:id', () => {

  let testPhotoId = ''
  beforeEach(async () => {
    // POST: /photos/multiple
    await request(app).post(`${v}/photos`)
      .set('Cookie', setup.cookies)
      .send({ url: 'www.picture.com', albumId: setup.albumId, })
      .expect(201)
      .then(res => testPhotoId = res.body.photo.id)
  })


  const SUT = (param?: string) =>
    request(app).patch(`${v}/photos${param}`)

  it('responds 400 if sending invalid body', async () => {
    const res = await SUT('/' + testPhotoId)
      .set('Cookie', setup.cookies)
      .send({ consumptionId: 123 })
    expect(res.statusCode).toBe(400)
  })

  it('responds 401 if cookie not provided', async () => {
    const res = await SUT('/' + testPhotoId)
      .send({ description: 'This is for test.' })
    expect(res.statusCode).toBe(401)
  })

  it('responds 404 if photo not found', async () => {
    const res = await SUT('/' + crypto.randomUUID())
      .set('Cookie', setup.cookies)
      .send({ albumId: crypto.randomUUID(), photoIds: [testPhotoId] })
    expect(res.statusCode).toBe(404)
  })

  it('responds 200 if cookie and body valid', async () => {
    const res = await SUT('/' + testPhotoId)
      .set('Cookie', setup.cookies)
      .send({ description: 'This is for test.' })
    expect(res.statusCode).toBe(200)
  })
})


describe('DELETE: /photos', () => {

  let photoIds: [string, string] = ['', '']
  beforeEach(async () => {
    // POST: /photos
    await Promise.all(photoIds.map((id, i) =>
      request(app).post(`${v}/photos`)
        .set('Cookie', setup.cookies)
        .send({ url: 'www.picture.com', albumId: setup.albumId, })
        .expect(201)
        .then(res => photoIds[i] = res.body.photo.id)))
  })

  const SUT = (query?: string) =>
    request(app).delete(`${v}/photos${query}`)

  it('responds 400 if sending invalid query', async () => {
    const res = await SUT(`?id[]=${photoIds[0]}`)
      .set('Cookie', setup.cookies)
    expect(res.statusCode).toBe(400)
  })

  it('responds 401 if cookie not provided', async () => {
    const res = await SUT(`?ids[]=${photoIds[0]}`)
    expect(res.statusCode).toBe(401)
  })

  xit('responds 404 if photo not found', async () => {
    const res = await SUT(`?ids[]=${crypto.randomUUID()}`)
      .set('Cookie', setup.cookies)
    expect(res.statusCode).toBe(404)
  })

  it('responds 200 if cookie and body valid', async () => {
    const res = await SUT(
      `?ids[]=${photoIds[0]}&ids[]=${photoIds[1]}`
    ).set('Cookie', setup.cookies)
    expect(res.statusCode).toBe(200)
    expect(res.body.count).toBe(2)
  })
})