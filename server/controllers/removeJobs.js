const { Queue: QueueMq } = require('bullmq');

const GRACE_TIME_MS = 5000;
const LIMIT = 1000;

const removeJobs = async (req, res) => {
  const { queueName } = req.params;
  const { bullMasterQueues } = req.app.locals;

  const queue = bullMasterQueues[queueName];
  if (!queue) {
    return res.status(404).send({
      error: 'Queue not found',
    });
  }

  if (!Array.isArray(req.body.jobs)) {
    if (queue instanceof QueueMq) {
      await queue.clean(GRACE_TIME_MS, LIMIT, req.body.status);
    } else {
      await queue.clean(GRACE_TIME_MS, req.body.status);
    }
  } else {
    const jobs = await Promise.all(
      req.body.jobs.map(jobId => queue.getJob(jobId)),
    );
    await Promise.all(jobs.map(job => job.remove()));
  }

  return res.sendStatus(200);
};

module.exports = removeJobs;
