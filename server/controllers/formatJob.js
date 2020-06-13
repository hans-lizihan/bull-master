function getDelayedTo(job) {
  if (job.processedOn) {
    return parseInt(job.processedOn, 10) + parseInt(job.opts.delay, 10);
  }

  return parseInt(job.timestamp, 10) + parseInt(job.opts.delay, 10);
}

module.exports = (job) => {
  const jobProps = job.toJSON();

  return {
    id: jobProps.id,
    timestamp: jobProps.timestamp,
    processedOn: jobProps.processedOn,
    finishedOn: jobProps.finishedOn,
    data: jobProps.data,
    failReason: jobProps.failReason,
    delayedTo: getDelayedTo(job),
    progress: jobProps.progress,
    attemptsMade: jobProps.attemptsMade,
    attemptsTotal: job.opts.attempts,
    name: jobProps.name,
  };
};
