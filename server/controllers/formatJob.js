module.exports = job => {
  const jobProps = job.toJSON();

  return {
    id: jobProps.id,
    timestamp: jobProps.timestamp,
    processedOn: jobProps.processedOn,
    finishedOn: jobProps.finishedOn,
    progress: jobProps.progress,
    attempts: jobProps.attemptsMade,
    delay: job.opts.delay,
    failedReason: jobProps.failedReason,
    stacktrace: jobProps.stacktrace,
    opts: jobProps.opts,
    data: jobProps.data,
    name: jobProps.name,
  };
};
