const formatJob = require('./formatJob');

module.exports = async (req, res) => {
  const { bullMasterQueues } = req.app.locals;
  const { queueName } = req.params;
  const queue = bullMasterQueues[queueName];
  const job = await queue.getJob(req.params.jobId);
  res.json({
    ...formatJob(job),
    ...job.toJSON(),
    status: await job.getState(),
    logs: await queue.getJobLogs(job.id),
  });
};
