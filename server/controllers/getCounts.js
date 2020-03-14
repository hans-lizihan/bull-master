const STATUSES = [
  'active',
  'completed',
  'delayed',
  'failed',
  'paused',
  'waiting',
];

module.exports = async queue => {
  return queue.getJobCounts(...STATUSES);
};
