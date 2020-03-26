module.exports = async (req, res) => {
  const { bullMasterQueues } = req.app.locals;
  const { queueName } = req.params;
  const queue = bullMasterQueues[queueName];

  if (!queue) {
    return res.status(404).send({
      error: 'Queue not found',
    });
  }

  const jobs =
    req.body.status === 'failed'
      ? await queue.getFailed()
      : await Promise.all(req.body.jobs.map(jobId => queue.getJob(jobId)));

  await Promise.all(
    jobs.map(async job => {
      try {
        await job.retry();
      } catch (e) {
        await job.moveToFailed(e, true);
      }
    }),
  );

  return res.sendStatus(204);
};
