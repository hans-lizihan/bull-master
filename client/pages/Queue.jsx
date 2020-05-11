import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { useResource } from 'react-request-hook';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import { Link as RouterLink } from 'react-router-dom';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Link from '@material-ui/core/Link';
import { formatISO, formatDistanceStrict } from 'date-fns';
import CircularProgress from '../components/CircularProgress';
import StatusTabs from './StatusTabs';
import useInterval from '../hooks/useInterval';
import Table from '../components/Table';
import client from '../network/client';

const FIELDS = {
  active: ['id', 'name', 'progress', 'timestamp', 'processedOn', 'actions'],
  completed: [
    'id',
    'name',
    'finishedOn',
    'timestamp',
    'processedOn',
    'actions',
  ],
  delayed: ['id', 'name', 'attempts', 'timestamp', 'delayedTo', 'actions'],
  failed: ['id', 'attempts', 'name', 'progress', 'finishedOn', 'actions'],
  paused: ['id', 'name', 'timestamp', 'processedOn', 'actions'],
  waiting: ['id', 'name', 'attempts', 'timestamp', 'finishedOn', 'actions'],
};

const Queue = ({ match, history, location }) => {
  const [queue, getQueue] = useResource(() => ({
    url: `/queues/${match.params.queueName}`,
    method: 'GET',
  }));
  useInterval(getQueue, 4000);
  const [jobs, getJobs] = useResource(({ page, pageSize, status }) => ({
    url: `/queues/${match.params.queueName}/jobs?status=${status}&pageSize=${pageSize}&page=${page}`,
    method: 'GET',
  }));
  const [, retryAll] = useResource(() => ({
    url: `/queues/${match.params.queueName}/retries`,
    method: 'POST',
    data: {
      status: 'failed',
    },
  }));
  const [, cleanQueue] = useResource(() => ({
    url: `/queues/${match.params.queueName}/clean`,
    method: 'POST',
  }));
  const [, pauseQueue] = useResource(() => ({
    url: `/queues/${match.params.queueName}/pause`,
    method: 'POST',
  }));
  const [, resumeQueue] = useResource(() => ({
    url: `/queues/${match.params.queueName}/resume`,
    method: 'POST',
  }));
  const [, promoteAll] = useResource(() => ({
    url: `/queues/${match.params.queueName}/promotes`,
    method: 'POST',
    data: {
      status: 'delayed',
    },
  }));
  const [selected, setSelected] = useState([]);
  const query = new URLSearchParams(location.search);
  const status = query.get('status') || 'active';
  const page = parseInt(query.get('page') || 0, 10);
  const pageSize = parseInt(query.get('pageSize') || 5, 10);
  const refreshTable = () => {
    const newQuery = new URLSearchParams(location.search);
    const newStatus = newQuery.get('status') || 'active';
    const newPage = parseInt(newQuery.get('page') || 0, 10);
    const newPageSize = parseInt(newQuery.get('pageSize') || 5, 10);
    getJobs({
      page: newPage,
      pageSize: newPageSize,
      status: newStatus,
    });
  };
  useInterval(refreshTable, 4000);
  const handleStatusChange = (event, newValue) => {
    const newQuery = new URLSearchParams(location.search);
    newQuery.set('status', newValue);
    newQuery.set('page', 0);
    setSelected([]);
    getJobs({
      page,
      pageSize,
      status: newValue,
    });
    history.push(`${location.pathname}?${newQuery.toString()}`);
  };

  const handleChangePage = (e, newPage) => {
    const newQuery = new URLSearchParams(location.search);
    newQuery.set('page', newPage);
    getJobs({
      page: newPage,
      pageSize,
      status,
    });
    history.push(`${location.pathname}?${newQuery.toString()}`);
  };
  const handleChangeRowsPerPage = e => {
    const newQuery = new URLSearchParams(location.search);
    newQuery.set('pageSize', e.target.value);
    getJobs({
      page,
      pageSize: e.target.value,
      status,
    });
    history.push(`${location.pathname}?${newQuery.toString()}`);
  };

  const data = jobs.data?.data || [];

  // TODO: move selected countrol outside
  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = data.map(n => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleCellClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleBulkRetry = () => {
    client({
      url: `/queues/${match.params.queueName}/retries`,
      method: 'POST',
      data: {
        jobs: selected,
      },
    })
      .then(() => setSelected([]))
      .then(refreshTable);
  };

  const handleBulkPromote = () => {
    client({
      url: `/queues/${match.params.queueName}/promotes`,
      method: 'POST',
      data: {
        jobs: selected,
      },
    })
      .then(() => setSelected([]))
      .then(refreshTable);
  };

  const { name, counts } = queue.data || {};

  return (
    <Grid container spacing={3}>
      <Grid container item xs={12} justify="space-between">
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} color="inherit" to="/">
            Dashboard
          </Link>
          <Typography color="textPrimary">{name}</Typography>
        </Breadcrumbs>
        <div>
          <Button variant="outlined" onClick={pauseQueue}>
            Puase Queue
          </Button>
          <Button onClick={resumeQueue}>Resume Queue</Button>
          <Button onClick={cleanQueue}>Clean Queue</Button>
        </div>
      </Grid>
      <Grid item xs={12}>
        <StatusTabs
          value={status}
          counts={counts}
          onChange={handleStatusChange}
        />
      </Grid>
      <Grid item xs={12}>
        <Table
          title={name}
          page={page}
          selected={selected}
          onChangePage={handleChangePage}
          onCellClick={handleCellClick}
          onSelectAllClick={handleSelectAllClick}
          columns={[
            { title: 'ID', field: 'id' },
            { title: 'Job Name', field: 'name' },
            {
              title: 'Created At',
              field: 'timestamp',
              render: value =>
                value && (
                  <Tooltip
                    placement="top"
                    title={`${formatDistanceStrict(value, Date.now())} ago`}
                  >
                    <span>{formatISO(value)}</span>
                  </Tooltip>
                ),
            },
            {
              title: 'Started At',
              field: 'processedOn',
              render: value =>
                value && (
                  <Tooltip placement="top" title={formatISO(value)}>
                    <span>{formatDistanceStrict(value, Date.now())} ago</span>
                  </Tooltip>
                ),
            },
            {
              title: 'Completed At',
              field: 'finishedOn',
              render: value =>
                value ? (
                  <Tooltip placement="top" title={formatISO(value)}>
                    <span>{formatDistanceStrict(value, Date.now())} ago</span>
                  </Tooltip>
                ) : (
                  'Not completed'
                ),
            },
            {
              title: 'Delayed To',
              field: 'delayedTo',
              render: value =>
                value && (
                  <Tooltip placement="top" title={formatISO(value)}>
                    <span>{formatDistanceStrict(value, Date.now())} later</span>
                  </Tooltip>
                ),
            },
            {
              title: 'Progress',
              field: 'progress',
              render: value => <CircularProgress size={48} value={value} />,
            },
            {
              title: 'Attempts',
              field: 'attempts',
              render: (val, field) => field.attemptsMade,
            },
            {
              title: 'Actions',
              field: 'actions',
              render: (val, field) => (
                <Button
                  size="small"
                  component={RouterLink}
                  startIcon={<VisibilityIcon />}
                  to={`${location.pathname}/${field.id}`}
                >
                  Details
                </Button>
              ),
            },
          ].filter(column => FIELDS[status].includes(column.field))}
          rowsPerPage={pageSize}
          pageSizeOptions={[5, 20, 50, 100]}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          totalCount={jobs.data?.totalCount}
          bulkActions={
            <div>
              {status === 'delayed' && (
                <Button onClick={handleBulkPromote}>Promote</Button>
              )}
              {status === 'failed' && (
                <Button onClick={handleBulkRetry}>Retry</Button>
              )}
            </div>
          }
          actions={
            <div>
              {status === 'delayed' && (
                <Button onClick={promoteAll}>Promote All</Button>
              )}
              {status === 'failed' && (
                <Button onClick={retryAll}>Retry All</Button>
              )}
            </div>
          }
          data={data}
        />
      </Grid>
    </Grid>
  );
};

Queue.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      queueName: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
    pathname: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default Queue;
