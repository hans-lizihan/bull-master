const getCounts = require('./getCounts');

module.exports = async (req, res) => {
  const { bullMasterQueues } = req.app.locals;
  const pairs = Object.entries(bullMasterQueues);

  if (pairs.length === 0) {
    return [];
  }

  const queues = await Promise.all(
    pairs.map(async ([name, queue]) => ({
      name,
      counts: await getCounts(queue),
    })),
  );

  return res.json({
    data: queues,
  });
};
