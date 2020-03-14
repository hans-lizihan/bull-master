/* eslint-disable no-await-in-loop */
const { Queue: QueueMQ, Worker } = require('bullmq');
const Queue3 = require('bull');
const express = require('express');
const bullMaster = require('./server/index');

const app = express();

const sleep = t => new Promise(resolve => setTimeout(resolve, t * 1000));

const redisOptions = {
  port: 6379,
  host: 'localhost',
  password: '',
  tls: false,
};

const createQueue3 = name => new Queue3(name, { redis: redisOptions });
const createQueueMQ = name => new QueueMQ(name, { connection: redisOptions });

const run = () => {
  const exampleBullName = 'ExampleBull';
  const exampleBull = createQueue3(exampleBullName);
  const exampleBullMqName = 'ExampleBullMQ';
  const exampleBullMq = createQueueMQ(exampleBullMqName);
  exampleBull.process(async job => {
    for (let i = 0; i <= 100; i += 1) {
      await sleep(Math.random());
      job.progress(i);
      if (Math.random() * 200 < 1) throw new Error(`Random error ${i}`);
    }
  });

  // eslint-disable-next-line no-new
  new Worker(exampleBullMqName, async job => {
    for (let i = 0; i <= 100; i += 1) {
      await sleep(Math.random());
      await job.updateProgress(i);

      if (Math.random() * 200 < 1) throw new Error(`Random error ${i}`);
    }
  });

  app.use('/add', (req, res) => {
    const opts = req.query.opts || {};
    const delay = parseInt(opts.delay, 10) || 0;
    exampleBull.add(
      { title: req.query.title },
      {
        delay: delay * 1000,
      },
    );
    exampleBullMq.add('Add', { title: req.query.title }, opts);

    res.json({
      ok: true,
    });
  });

  app.use(
    '/ui',
    bullMaster({
      queues: [exampleBullMq, exampleBull],
    }),
  );
  app.listen(4889, () => {
    console.log('Running on 4889...');
    console.log('For the UI, open http://localhost:4889/ui');
    console.log('Make sure Redis is running on port 6379 by default');
    console.log('To populate the queue, run:');
    console.log('  curl http://localhost:4889/add?title=Example');
    console.log('To populate the queue with custom options (opts), run:');
    console.log('  curl http://localhost:4889/add?title=Test&opts[delay]=900');
  });
};

run();
