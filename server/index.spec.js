const { Queue } = require('bullmq')
const request = require('supertest')

const bullMaster = require('./index')

describe('happy', () => {
  it('should be able to set queue', async () => {
    const paintQueue = new Queue('Paint', {
      connection: {
        host: 'localhost',
        port: 6379,
      },
    })

    const app = bullMaster({ queues: [paintQueue] });

    await request(app)
      .get('/queues')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(JSON.parse(res.text)).toMatchInlineSnapshot(
          {
            stats: {
              blocked_clients: expect.any(String),
              connected_clients: expect.any(String),
              mem_fragmentation_ratio: expect.any(String),
              redis_version: expect.any(String),
              total_system_memory: expect.any(String),
              used_memory: expect.any(String),
            },
          },
          `
          Object {
            "queues": Array [
              Object {
                "counts": Object {
                  "active": 0,
                  "completed": 0,
                  "delayed": 0,
                  "failed": 0,
                  "paused": 0,
                  "waiting": 0,
                },
                "jobs": Array [],
                "name": "bull:Paint:~",
              },
            ],
            "stats": Object {
              "blocked_clients": Any<String>,
              "connected_clients": Any<String>,
              "mem_fragmentation_ratio": Any<String>,
              "redis_version": Any<String>,
              "total_system_memory": Any<String>,
              "used_memory": Any<String>,
            },
          }
        `,
        )
      })
    await paintQueue.close();
  })
})
