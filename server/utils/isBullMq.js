module.exports = queue => {
  try {
    // eslint-disable-next-line
    const { Queue: QueueMq } = require('bullmq');
    return queue instanceof QueueMq;
  } catch (e) {
    return false;
  }
};
