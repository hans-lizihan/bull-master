const { STATUSES } = require('./constants');

module.exports = async (req, res) => {
  const { bullMasterQueues } = req.app.locals;
  const queue = await bullMasterQueues[req.params.queueName];
  const counts = await queue.getJobCounts(...STATUSES);
  res.json({
    name: req.params.queueName,
    counts,
  });
};
