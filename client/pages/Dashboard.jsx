import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useResource } from 'react-request-hook';
import RedisStats from '../components/RedisStats';
import useInterval from '../hooks/useInterval';
import QueueList from '../components/QueueList';
import Section from '../components/Section';

const Dashboard = () => {
  const [stats, getStats] = useResource(() => ({
    url: '/redis-stats',
    method: 'GET',
  }));
  useInterval(getStats, 30000);
  const [queues, getQueues] = useResource(() => ({
    url: '/queues',
    method: 'GET',
  }));
  useInterval(getQueues, 30000);
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Section>
          <RedisStats stats={stats.data || {}} />
        </Section>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Section>
          <div>Queue Summary here</div>
        </Section>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Section>
          <div>This is a chart</div>
        </Section>
      </Grid>
      <Grid item xs={12}>
        <QueueList queues={queues.data?.data || []} />
      </Grid>
    </Grid>
  );
};

Dashboard.propTypes = {};

export default Dashboard;
