import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { Redis } from 'ioredis'

jest.setTimeout(30000)

jest.mock('ioredis', () => {
  const mockRedis = jest.fn().mockImplementation(() => ({
    del: jest.fn().mockResolvedValue(1),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(null),
    quit: jest.fn().mockResolvedValue(null),
  }))
  return { __esModule: true, default: mockRedis, Redis: mockRedis }
})

describe('UserController (e2e)', () => {
  let app: INestApplication
  let redisClient: Redis

  let userId: number
  let userToken: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [AppModule] }).compile()
    app = moduleFixture.createNestApplication()
    redisClient = new Redis()

    await app.init()

    await request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'User',
        email: 'user@teste.com.br',
        username: 'user',
        password: '123456'
      })
      .expect(201)

    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'user@teste.com.br',
        password: '123456'
      })
      .expect(201)

    userToken = loginRes.body.access_token

    const usersRes = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)

    const user = usersRes.body.find((u: any) => u.email === 'user@teste.com.br')
    userId = user.id
  })

  afterAll(async () => {
    await redisClient.quit()
    await app.close()
  })

  it('/users (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)

    expect(Array.isArray(res.body)).toBe(true)
  })

  it('/users/:id (GET)', async () => {
    const res = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)

    expect(res.body).toHaveProperty('id', userId)
  })

  it('/users/:id (PATCH)', async () => {
    const updateDto = { name: 'Updated User' }

    const res = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(updateDto)
      .expect(200)

    expect(res.body.name).toBe('Updated User')
  })

  it('/users/avatar (POST)', async () => {
    await request(app.getHttpServer())
      .post('/users/avatar')
      .set('Authorization', `Bearer ${userToken}`)
      .attach('avatar', Buffer.from([0xff, 0xd8, 0xff]), 'avatar.jpg')
      .expect(201)
  })

  it('/users/:id (DELETE)', async () => {
    await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
  })
})