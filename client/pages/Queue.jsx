import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { useResource, useRequest } from 'react-request-hook';
import Table from 'material-table';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { formatISO, formatDistance } from 'date-fns';
import StatusTabs from './StatusTabs';
import useInterval from '../hooks/useInterval';

const FIELDS = {
  active: ['id', 'attempts', 'name', 'progress', 'processedOn'],
  completed: ['id', 'attempts', 'data', 'name', 'finishedOn', 'processedOn'],
  delayed: ['id', 'attempts', 'data', 'delay', 'name', 'promote'],
  failed: ['id', 'attempts', 'name', 'progress', 'finishedOn'],
  paused: ['id', 'attempts', 'name', 'processedOn'],
  waiting: ['id', 'data', 'name', 'processedOn'],
};

const Queue = ({ match, history, location }) => {
  const tableRef = useRef();
  const [queue, getQueue] = useResource(() => ({
    url: `/queues/${match.params.queueName}`,
    method: 'GET',
  }));
  useInterval(getQueue, 4000);
  const [getJobsRequest, getJobs] = useRequest(
    ({ page, pageSize, status }) => ({
      url: `/queues/${match.params.queueName}/jobs?status=${status}&pageSize=${pageSize}&page=${page}`,
      method: 'GET',
    }),
  );
  const status = new URLSearchParams(location.search).get('status') || 'active';
  const refreshTable = () => {
    if (tableRef.current) {
      if (getJobsRequest.hasPending) {
        getJobsRequest.clear();
      }
      tableRef.current.onQueryChange();
    }
  };
  useInterval(refreshTable, 4000);
  const handleStatusChange = (event, newValue) => {
    const params = new URLSearchParams(location.search);
    params.set('status', newValue);
    history.push(`${location.pathname}?${params.toString()}`);
    refreshTable();
  };

  const { name, counts } = queue.data || {};

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} color="inherit" to="/">
            Dashboard
          </Link>
          <Typography color="textPrimary">{name}</Typography>
        </Breadcrumbs>
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
          tableRef={tableRef}
          columns={[
            { title: 'ID', field: 'id' },
            { title: 'Job Name', field: 'name' },
            {
              title: 'Started At',
              field: 'processedOn',
              render: field =>
                field.processedOn && (
                  <Tooltip title={formatISO(field.processedOn)}>
                    <span>
                      {formatDistance(field.processedOn, Date.now())} ago
                    </span>
                  </Tooltip>
                ),
            },
            {
              title: 'Completed At',
              field: 'finishedOn',
              render: field =>
                field.finishedOn && (
                  <Tooltip title={formatISO(field.finishedOn)}>
                    <span>
                      {formatDistance(field.finishedOn, Date.now())} ago
                    </span>
                  </Tooltip>
                ),
            },
            {
              title: 'Progress',
              field: 'progress',
              render: field => (
                <Tooltip title={`${field.progress}%`}>
                  <LinearProgress
                    variant="determinate"
                    value={field.progress}
                  />
                </Tooltip>
              ),
            },
            {
              title: 'Attempts',
              field: 'attempts',
              render: field => field.opts.attempts,
            },
          ].filter(column => FIELDS[status].includes(column.field))}
          options={{
            search: false,
            pageSize: parseInt(
              new URLSearchParams(location.search).get('pageSize') || 5,
              10,
            ),
            pageSizeOptions: [5, 20, 50, 100],
          }}
          components={{
            OverlayLoading: () => null,
          }}
          data={query => {
            const { page, pageSize } = query;
            const search = new URLSearchParams({
              status,
              page,
              pageSize,
            });
            history.push(`${location.pathname}?${search.toString()}`);
            const { ready } = getJobs({
              status,
              page: query.page,
              pageSize: query.pageSize,
            });
            return ready().catch(e => {
              if (!e.isCancel) {
                console.error(e);
              }
              return e;
            });
          }}
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
