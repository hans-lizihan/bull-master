const getCounts = require('./getCounts');

module.exports = async (req, res) => {
  const { bullMasterQueues } = req.app.locals;
  const queue = await bullMasterQueues[req.params.queueName];
  const counts = await getCounts(queue);
  res.json({
    name: req.params.queueName,
    counts,
  });
};
