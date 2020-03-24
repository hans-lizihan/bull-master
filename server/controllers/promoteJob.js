const promoteJob = async (req, res) => {
  const { bullMasterQueues } = req.app.locals;
  const { queueName } = req.params;
  const queue = bullMasterQueues[queueName];

  if (!queue) {
    return res.status(404).send({
      error: 'Queue not found',
    });
  }

  const jobs = await Promise.all(
    req.body.jobs.map(jobId => queue.getJob(jobId)),
  );

  await Promise.all(jobs.map(job => job.promote()));

  return res.sendStatus(204);
};

module.exports = promoteJob;
