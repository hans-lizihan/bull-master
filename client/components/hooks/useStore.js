import { useEffect, useCallback, useRef, useState } from 'react';
import qs from 'querystring';

const interval = 5000;

export default function useStore(basePath) {
  const [state, setState] = useState({
    data: null,
    loading: true,
  });
  const [selectedStatuses, setSelectedStatuses] = useState({});

  const poll = useRef();
  const stopPolling = useCallback(() => {
    if (poll.current) {
      clearTimeout(poll.current);
      poll.current = undefined;
    }
  }, [poll]);

  const update = useCallback(
    () =>
      fetch(`${basePath}/queues/?${qs.encode(selectedStatuses)}`)
        .then(res => (res.ok ? res.json() : Promise.reject(res)))
        .then(data => setState({ data, loading: false })),
    [basePath, selectedStatuses, setState],
  );

  const runPolling = useCallback(() => {
    update()
      .catch(error => console.error('Failed to poll', error))
      .then(() => {
        const timeoutId = setTimeout(runPolling, interval);
        poll.current = timeoutId;
      });
  }, [poll, update]);

  useEffect(() => {
    stopPolling();
    runPolling();

    return stopPolling;
  }, [selectedStatuses, runPolling, stopPolling]);

  const promoteJob = queueName => job => () =>
    fetch(`${basePath}/queues/${queueName}/${job.id}/promote`, {
      method: 'put',
    }).then(update);

  const retryJob = queueName => job => () =>
    fetch(`${basePath}/queues/${queueName}/${job.id}/retry`, {
      method: 'put',
    }).then(update);

  const retryAll = queueName => () =>
    fetch(`${basePath}/queues/${queueName}/retry`, {
      method: 'put',
    }).then(update);

  const cleanAllDelayed = queueName => () =>
    fetch(`${basePath}/queues/${queueName}/clean/delayed`, {
      method: 'put',
    }).then(update);

  const cleanAllFailed = queueName => () =>
    fetch(`${basePath}/queues/${queueName}/clean/failed`, {
      method: 'put',
    }).then(update);

  const cleanAllCompleted = queueName => () =>
    fetch(`${basePath}/queues/${queueName}/clean/completed`, {
      method: 'put',
    }).then(update);

  return {
    state,
    promoteJob,
    retryJob,
    retryAll,
    cleanAllDelayed,
    cleanAllFailed,
    cleanAllCompleted,
    selectedStatuses,
    setSelectedStatuses,
  };
}
