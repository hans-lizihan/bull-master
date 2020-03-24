const formatJob = require('./formatJob');

module.exports = async (req, res) => {
  const { bullMasterQueues } = req.app.locals;
  const { queueName } = req.params;
  const queue = bullMasterQueues[queueName];
  const job = await queue.getJob(req.params.jobId);
  const logs = await queue.getJobLogs(req.params.jobId);
  const status = await job.getState();

  const formattedJob = formatJob(job);
  if (status !== 'delayed') {
    formattedJob.delayedTo = null;
  }
  res.json({
    ...formattedJob,
    ...job.toJSON(),
    status,
    logs: logs.logs,
  });
};
