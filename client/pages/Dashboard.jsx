import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { useResource } from 'react-request-hook';
import RedisStats from '../components/RedisStats';
import useInterval from '../hooks/useInterval';
import QueueList from '../components/QueueList';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));

const Dashboard = () => {
  const classes = useStyles();
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
        <Paper className={classes.paper}>
          <RedisStats stats={stats.data || {}} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Paper className={classes.paper}>
          <div>Queue Summary here</div>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Paper className={classes.paper}>
          <div>This is a chart</div>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <QueueList queues={queues.data?.queues || []} />
      </Grid>
    </Grid>
  );
};

Dashboard.propTypes = {};

export default Dashboard;
