const promoteJob = async (req, res) => {
  const { bullMasterQueues } = req.app.locals;
  const { queueName, id } = req.params;
  const { queue } = bullMasterQueues[queueName];

  if (!queue) {
    return res.status(404).send({
      error: 'Queue not found',
    });
  }

  const job = await queue.getJob(id);

  if (!job) {
    return res.status(404).send({
      error: 'Job not found',
    });
  }

  await job.promote();

  return res.sendStatus(204);
};

module.exports = promoteJob;
