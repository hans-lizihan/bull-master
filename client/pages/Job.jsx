import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Link as RouterLink } from 'react-router-dom';
import { useResource, useRequest } from 'react-request-hook';
import { formatISO } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import MuiCircularProgress from '@material-ui/core/CircularProgress';
import CircularProgress from '../components/CircularProgress';
import Section from '../components/Section';
import Title from '../components/Title';
import Status from '../components/Status';
import useInterval from '../hooks/useInterval';

const useStyles = makeStyles(theme => ({
  remove: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.light,
    },
  },
  retry: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.warning.light,
    },
  },
  promote: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.success.light,
    },
  },
  buttonContainer: {
    position: 'relative',
    marginRight: 16,
    '&:last-child': {
      marginRight: 0,
    },
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    size: 24,
    marginTop: -12,
    marginLeft: -12,
  },
}));

const Job = ({ match, history }) => {
  const classes = useStyles();
  const [job, getJob] = useResource(({ jobId, queueName }) => ({
    url: `/queues/${queueName}/jobs/${jobId}`,
    method: 'GET',
  }));
  const [, createRemoveRequest] = useRequest(({ jobId, queueName }) => ({
    url: `/queues/${queueName}/removes`,
    method: 'POST',
    data: {
      jobs: [jobId],
    },
  }));
  const [retryJobResponse, retryJob] = useResource(({ jobId, queueName }) => ({
    url: `/queues/${queueName}/retries`,
    method: 'POST',
    data: {
      jobs: [jobId],
    },
  }));
  const [promoteJobResponse, promoteJob] = useResource(
    ({ jobId, queueName }) => ({
      url: `/queues/${queueName}/promotes`,
      method: 'POST',
      data: {
        jobs: [jobId],
      },
    }),
  );
  const { jobId, queueName } = match.params;
  useInterval(() => {
    getJob({ jobId, queueName });
  }, 4000);
  const [isRemoving, setRemove] = useState(false);

  const handleRemove = () => {
    setRemove(true);
    createRemoveRequest({ jobId, queueName })
      .ready()
      .then(() => history.push(`/queues/${queueName}`));
  };
  const handlePromote = () => {
    promoteJob({ jobId, queueName });
    getJob({ jobId, queueName });
  };
  const handleRetry = () => {
    retryJob({ jobId, queueName });
    getJob({ jobId });
  };

  const stacktrace = job.data?.stacktrace || [];
  const logs = job.data?.logs || [];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link component={RouterLink} color="inherit" to="/">
            Dashboard
          </Link>
          <Link
            component={RouterLink}
            color="inherit"
            to={`/queues/${queueName}`}
          >
            {queueName}
          </Link>
          <Typography color="textPrimary">#{jobId}</Typography>
        </Breadcrumbs>
      </Grid>
      <Grid item xs={12} md={8}>
        <Section>
          <Grid container alignItems="center" style={{ marginBottom: 16 }}>
            <Grid item xs={6} container alignItems="center">
              <Title style={{ marginRight: 16 }}>#{jobId}</Title>
              <Status style={{ marginRight: 16 }} status={job.data?.status} />
              <CircularProgress
                style={{ display: 'inline-block' }}
                value={job.data?.progress}
              />
            </Grid>
            <Grid
              item
              container
              xs={6}
              className={classes.actions}
              justify="flex-end"
            >
              <div
                disabled={retryJobResponse.isLoading}
                className={classes.buttonContainer}
              >
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.retry}
                  onClick={handleRetry}
                >
                  Retry
                </Button>
                {retryJobResponse.isLoading && (
                  <MuiCircularProgress size={24} className={classes.loader} />
                )}
              </div>
              <div disabled={isRemoving} className={classes.buttonContainer}>
                <Button
                  className={classes.remove}
                  variant="contained"
                  onClick={handleRemove}
                >
                  Remove
                </Button>
                {isRemoving && (
                  <MuiCircularProgress size={24} className={classes.loader} />
                )}
              </div>
              <div
                disabled={promoteJobResponse.isLoading}
                className={classes.buttonContainer}
              >
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.promote}
                  onClick={handlePromote}
                >
                  Promote
                </Button>
                {promoteJobResponse.isLoading && (
                  <MuiCircularProgress size={24} className={classes.loader} />
                )}
              </div>
            </Grid>
          </Grid>
          <Grid container style={{ marginBottom: 16 }} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="body1" component="span">
                Retries Attempted
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">{job.data?.attemptsMade}</Typography>
            </Grid>
          </Grid>
          <Grid container style={{ marginBottom: 16 }} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="body1" component="span">
                Total Configured Retries
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">{job.data?.attemptsTotal}</Typography>
            </Grid>
          </Grid>
          <Grid container style={{ marginBottom: 16 }} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="body1" component="span">
                Job Name
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">{job.data?.name}</Typography>
            </Grid>
          </Grid>
          <Grid container style={{ marginBottom: 16 }} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="body1" component="span">
                Delayed To
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body1">
                {job.data?.delayedTo ? formatISO(job.data?.delayedTo) : '-'}
              </Typography>
            </Grid>
          </Grid>
        </Section>
      </Grid>
      <Grid item xs={12} md={4}>
        <Section>
          <Grid container alignItems="center">
            <Grid item xs={8}>
              <Title>Timeline</Title>
              <List>
                <ListItem style={{ paddingLeft: 0 }}>
                  <ListItemText
                    secondary={
                      job.data?.timestamp ? formatISO(job.data?.timestamp) : '-'
                    }
                  >
                    Started At
                  </ListItemText>
                </ListItem>
                <ListItem style={{ paddingLeft: 0 }}>
                  <ListItemText
                    secondary={
                      job.data?.processedOn
                        ? formatISO(job.data?.processedOn)
                        : '-'
                    }
                  >
                    Processed At
                  </ListItemText>
                </ListItem>
                <ListItem style={{ paddingLeft: 0 }}>
                  <ListItemText
                    secondary={
                      job.data?.finishedOn
                        ? formatISO(job.data?.finishedOn)
                        : '-'
                    }
                  >
                    Finished At
                  </ListItemText>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Section>
      </Grid>
      <Grid item xs={12}>
        <Section>
          <Title>Data</Title>
          <pre>{JSON.stringify(job.data?.data, null, 2)}</pre>
        </Section>
      </Grid>
      {stacktrace.length > 0 && (
        <Grid item xs={12}>
          <Section>
            <Typography variant="h6">Error Stack</Typography>
            <List>
              {stacktrace.map((trace, index) => (
                /* eslint-disable-next-line */
                <ListItem key={`${trace}-${index}`}>
                  <pre>{trace}</pre>
                </ListItem>
              ))}
            </List>
          </Section>
        </Grid>
      )}
      {logs.length > 0 && (
        <Grid item xs={12}>
          <Section>
            <Typography variant="h6">Logs</Typography>
            <List>
              {logs.map((log, index) => (
                /* eslint-disable-next-line */
                <ListItem key={`${log}-${index}`}>
                  <pre>{log}</pre>
                </ListItem>
              ))}
            </List>
          </Section>
        </Grid>
      )}
      <Grid item xs={12}>
        <Section>
          <Title>Raw Data</Title>
          <pre>{JSON.stringify(job?.data, null, 2)}</pre>
        </Section>
      </Grid>
    </Grid>
  );
};

Job.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      jobId: PropTypes.string,
      queueName: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Job;
