const { Queue: QueueMq } = require('bullmq');

const GRACE_TIME_MS = 5000;
const LIMIT = 1000;

const cleanAll = async (req, res) => {
  const { queueName, queueStatus } = req.params;
  const { bullMasterQueues } = req.app.locals;

  const { queue } = bullMasterQueues[queueName];
  if (!queue) {
    return res.status(404).send({
      error: 'Queue not found',
    });
  }

  if (queue instanceof QueueMq) {
    await queue.clean(GRACE_TIME_MS, LIMIT, queueStatus);
  } else {
    await queue.clean(GRACE_TIME_MS, queueStatus);
  }

  return res.sendStatus(200);
};

module.exports = cleanAll;
