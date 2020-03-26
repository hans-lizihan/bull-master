module.exports = job => {
  const jobProps = job.toJSON();

  return {
    id: jobProps.id,
    timestamp: jobProps.timestamp,
    processedOn: jobProps.processedOn,
    finishedOn: jobProps.finishedOn,
    delayedTo:
      parseInt(jobProps.processedOn, 10) + parseInt(job.opts.delay, 10),
    progress: jobProps.progress,
    attemptsMade: jobProps.attemptsMade,
    attemptsTotal: job.opts.attempts,
    name: jobProps.name,
  };
};
