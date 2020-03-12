const formatJob = require('./formatJob');

module.exports = async (req, res) => {
  const { bullMasterQueues } = req.app.locals;
  const { queueName } = req.params;
  const { status, page: pageString, pageSize: pageSizeString } =
    req.query || {};
  const page = Math.max(parseInt(pageString || 0, 10), 0);
  const pageSize = parseInt(pageSizeString || 20, 10);
  const queue = bullMasterQueues[queueName];
  const counts = await queue.getJobCounts(status);
  const start = page * pageSize;
  const end = start + pageSize - 1;
  const jobs = await queue.getJobs([status], start, end);
  res.json({
    totalCount: Object.values(counts).reduce((acc, cur) => acc + cur, 0),
    pageSize,
    page,
    data: jobs.map(formatJob),
  });
};
