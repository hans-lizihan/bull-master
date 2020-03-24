const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Queue: QueueMq } = require('bullmq');

const queuesHandler = require('./controllers/queues');
const retryJob = require('./controllers/retryJob');
const promoteJob = require('./controllers/promoteJob');
const removeJobs = require('./controllers/removeJobs');
const render = require('./controllers/render');
const redisStats = require('./controllers/redisStats');
const jobs = require('./controllers/jobs');
const job = require('./controllers/job');
const queueHandler = require('./controllers/queue');

const wrapAsync = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = ({ queues }) => {
  const app = express();
  app.locals.bullMasterQueues = queues.reduce((acc, queue) => {
    const name = queue instanceof QueueMq ? queue.toKey('~') : queue.name;
    acc[name] = queue;
    return acc;
  }, {});

  return app
    .use((err, req, res, next) => {
      if (err) {
        return res.status(500).send({
          error: 'queue error',
          details: err.stack,
        });
      }
      return next();
    })
    .use(bodyParser.json())
    .use('/', express.static(path.resolve(__dirname, '../static')))

    .get('/', render)
    .get('/queues/:queueName', render)
    .get('/queues/:queueName/:jobId', render)
    .get('/api/redis-stats', wrapAsync(redisStats))
    .get('/api/queues', wrapAsync(queuesHandler))
    .get('/api/queues/:queueName', wrapAsync(queueHandler))
    .get('/api/queues/:queueName/jobs', wrapAsync(jobs))
    .get('/api/queues/:queueName/jobs/:jobId', wrapAsync(job))
    .post('/api/queues/:queueName/retries', wrapAsync(retryJob))
    .post('/api/queues/:queueName/promotes', wrapAsync(promoteJob))
    .post('/api/queues/:queueName/removes', wrapAsync(removeJobs));
};
