const STATUSES = [
  'active',
  'completed',
  'delayed',
  'failed',
  'paused',
  'waiting',
];

module.exports = async (queue) => queue.getJobCounts(...STATUSES);
