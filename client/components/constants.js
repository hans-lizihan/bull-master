export const STATUSES = {
  latest: 'latest',
  active: 'active',
  waiting: 'waiting',
  completed: 'completed',
  failed: 'failed',
  delayed: 'delayed',
  paused: 'paused',
};

export const FIELDS = {
  active: ['attempts', 'data', 'id', 'name', 'opts', 'progress', 'timestamps'],
  completed: [
    'attempts',
    'data',
    'id',
    'name',
    'opts',
    'progress',
    'timestamps',
  ],
  delayed: [
    'attempts',
    'data',
    'delay',
    'id',
    'name',
    'opts',
    'promote',
    'timestamps',
  ],
  failed: [
    'attempts',
    'failedReason',
    'id',
    'name',
    'progress',
    'retry',
    'timestamps',
  ],
  latest: ['attempts', 'data', 'id', 'name', 'opts', 'progress', 'timestamps'],
  paused: ['attempts', 'data', 'id', 'name', 'opts', 'timestamps'],
  waiting: ['data', 'id', 'name', 'opts', 'timestamps'],
};
