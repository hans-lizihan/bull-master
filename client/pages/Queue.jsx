import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { useResource, useRequest } from 'react-request-hook';
import Table from 'material-table';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import useInterval from '../hooks/useInterval';
import Section from '../components/Section';
import Title from '../components/Title';
import Status from '../components/Status';

const Queue = ({ match }) => {
  const [queue, getQueue] = useResource(() => ({
    url: `/queues/${match.params.queueName}`,
    method: 'GET',
  }));
  useInterval(getQueue, 4000);
  const [, createRequest] = useRequest(({ page, pageSize, status }) => ({
    url: `/${match.params.queueName}/jobs?status=${status}&pageSize=${pageSize}&page=${page}`,
    method: 'GET',
  }));
  const [status, setStatus] = React.useState('active');

  const handleChange = (event, newValue) => {
    setStatus(newValue);
  };

  const { name, counts } = queue.data || {};

  const { active, completed, delayed, failed, paused, waiting } = counts || {};

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Section>
          <Title style={{ marginBottom: 24 }}>{name}</Title>
        </Section>
      </Grid>
      <Grid item xs={12}>
        <AppBar position="static" color="default">
          <Tabs
            value={status}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab
              value="active"
              label={<Status status="active" count={active} />}
            />
            <Tab
              value="completed"
              label={<Status status="completed" count={completed} />}
            />
            <Tab
              value="delayed"
              label={<Status status="delayed" count={delayed} />}
            />
            <Tab
              value="paused"
              label={<Status status="paused" count={paused} />}
            />
            <Tab
              value="failed"
              label={<Status status="failed" count={failed} />}
            />
            <Tab
              value="waiting"
              label={<Status status="waiting" count={waiting} />}
            />
          </Tabs>
        </AppBar>
      </Grid>
      <Grid item xs={12}>
        <Table
          title="jobs"
          data={query => {
            const { ready } = createRequest({
              pageSize: query.pageSize,
              page: query.page + 1,
              status,
            });
            return ready().then(response => response.data);
          }}
          options={{ search: false }}
        />
      </Grid>
    </Grid>
  );
};

Queue.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      queueName: PropTypes.string,
    }),
  }).isRequired,
};

export default Queue;
