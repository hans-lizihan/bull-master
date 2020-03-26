module.exports = async (req, res) => {
  const { bullMasterQueues } = req.app.locals;
  const { queueName } = req.params;
  const queue = bullMasterQueues[queueName];
  await queue.clean(1000);
  res.status(204);
};
