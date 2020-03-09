const { Queue } = require('bullmq');
const request = require('supertest');

const bullMaster = require('./index');

describe('happy', () => {
  it('should be able to set queue', async () => {
    const paintQueue = new Queue('Paint', {
      connection: {
        host: 'localhost',
        port: 6379,
      },
    });

    const app = bullMaster({ queues: [paintQueue] });

    await request(app)
      .get('/api/queues')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        expect(JSON.parse(res.text)).toMatchInlineSnapshot(`
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
                "name": "bull:Paint:~",
              },
            ],
          }
        `);
      });
    await paintQueue.close();
  });
});
