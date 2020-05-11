module.exports = async (req, res) => {
  const { bullMasterQueues } = req.app.locals;
  const queue = await bullMasterQueues[req.params.queueName];
  await queue.resume();
  res.status(204);
};
