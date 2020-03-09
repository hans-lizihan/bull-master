const { STATUSES } = require('./constants');

module.exports = async (req, res) => {
  const { bullMasterQueues } = req.app.locals;
  const pairs = Object.entries(bullMasterQueues);

  if (pairs.length === 0) {
    return [];
  }

  const queues = await Promise.all(
    pairs.map(async ([name, queue]) => {
      const counts = await queue.getJobCounts(...STATUSES);

      return {
        name,
        counts,
      };
    }),
  );

  return res.json({
    data: queues,
  });
};
