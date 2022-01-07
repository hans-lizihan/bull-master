import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useResource } from 'react-request-hook';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import red from '@material-ui/core/colors/red';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import indigo from '@material-ui/core/colors/indigo';
import orange from '@material-ui/core/colors/orange';
import lightBlue from '@material-ui/core/colors/lightBlue';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import RedisStats from '../components/RedisStats';
import useInterval from '../hooks/useInterval';
import QueueList from '../components/QueueList';
import Section from '../components/Section';
import Title from '../components/Title';

const COLORS = {
  active: purple[300],
  completed: green[300],
  delayed: indigo[300],
  failed: red[300],
  paused: orange[300],
  waiting: lightBlue[300],
};

const transformStatForPieChart = (queues, filters) => {
  const sum = queues
    .map((queue) => queue.counts)
    .reduce((acc, cur) => {
      Object.keys(cur).forEach((key) => {
        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key] += cur[key];
      });
      return acc;
    }, {});
  const result = Object.entries(sum)
    .filter(([key]) => filters.includes(key))
    .map(([key, value]) => ({
      name: key,
      value,
    }));
  return result;
};

const calculatePercentage = (data, status) => {
  if (data.length === 0) return 0.0;
  const sum = data.reduce((acc, cur) => acc + cur.value, 0);
  const target = data.find((d) => d.name === status);
  const value = target?.value || 0;
  if (sum === 0) return 0.0;
  return ((value / sum) * 100).toFixed(2);
};

const useStyles = makeStyles({
  stat: {
    borderLeftWidth: 5,
    borderLeftStyle: 'solid',
    paddingLeft: 14,
    paddingRight: 14,
  },
  active: {
    borderColor: purple[300],
  },
  completed: {
    borderColor: green[300],
  },
  delayed: {
    borderColor: indigo[300],
  },
  failed: {
    borderColor: red[300],
  },
  paused: {
    borderColor: orange[300],
  },
  waiting: {
    borderColor: lightBlue[300],
  },
});

function Dashboard() {
  const classes = useStyles();
  const [stats, getStats] = useResource(() => ({
    url: '/redis-stats',
    method: 'GET',
  }));
  useInterval(getStats, 4000);
  const [queues, getQueues] = useResource(() => ({
    url: '/queues',
    method: 'GET',
  }));
  useInterval(getQueues, 4000);
  const inQueuePieData = transformStatForPieChart(queues.data?.data || [], [
    'active',
    'paused',
    'delayed',
    'waiting',
  ]);
  const completedPieData = transformStatForPieChart(queues.data?.data || [], [
    'completed',
    'failed',
  ]);
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Section>
          <RedisStats stats={stats.data || {}} />
        </Section>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Section>
          <Title>Currently In Queue</Title>
          <Grid container justify="center">
            <PieChart width={300} height={300}>
              <Pie
                dataKey="value"
                nameKey="name"
                data={inQueuePieData}
                cx={150}
                cy={150}
                paddingAngle={1}
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {inQueuePieData.map((d) => (
                  <Cell key={d.name} fill={COLORS[d.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Grid>
          <Grid container justify="center">
            <Title
              variant="body2"
              component="span"
              className={clsx(classes.stat, classes.active)}
            >
              Active - {calculatePercentage(inQueuePieData, 'active')}%
            </Title>
            <Title
              variant="body2"
              component="span"
              className={clsx(classes.stat, classes.delayed)}
            >
              Delayed - {calculatePercentage(inQueuePieData, 'delayed')}%
            </Title>
            <Title
              variant="body2"
              component="span"
              className={clsx(classes.stat, classes.paused)}
            >
              Paused - {calculatePercentage(inQueuePieData, 'paused')}%
            </Title>
          </Grid>
        </Section>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Section>
          <Title>Finished Jobs</Title>
          <Grid container justify="center">
            <PieChart width={300} height={300}>
              <Pie
                dataKey="value"
                nameKey="name"
                data={completedPieData}
                cx={150}
                cy={150}
                paddingAngle={1}
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {completedPieData.map((d) => (
                  <Cell key={d.name} fill={COLORS[d.name]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Grid>
          <Grid container justify="center">
            <Title
              variant="body2"
              component="span"
              className={clsx(classes.stat, classes.completed)}
            >
              Completed - {calculatePercentage(completedPieData, 'completed')}%
            </Title>
            <Title
              variant="body2"
              component="span"
              className={clsx(classes.stat, classes.failed)}
            >
              Failed - {calculatePercentage(completedPieData, 'failed')}%
            </Title>
          </Grid>
        </Section>
      </Grid>
      <Grid item xs={12}>
        <QueueList queues={queues.data?.data || []} />
      </Grid>
    </Grid>
  );
}

Dashboard.propTypes = {};

export default Dashboard;
