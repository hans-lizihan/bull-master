module.exports = async (req, res) => {
  const { queueName } = req.params;
  const { bullMasterQueues } = req.app.locals;

  const queue = bullMasterQueues[queueName];
  if (!queue) {
    return res.status(404).send({ error: 'queue not found' });
  }

  const jobs = await queue.getJobs(['failed']);
  await Promise.all(jobs.map(job => job.retry()));

  return res.sendStatus(200);
};
