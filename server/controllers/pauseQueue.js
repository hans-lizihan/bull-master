module.exports = async (req, res) => {
  const { bullMasterQueues } = req.app.locals;
  const queue = await bullMasterQueues[req.params.queueName];
  await queue.pause();
  res.status(204);
};
