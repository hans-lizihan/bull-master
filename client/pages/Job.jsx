import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { useResource } from 'react-request-hook';

const Job = ({ match }) => {
  const [job, getJob] = useResource(({ jobId, queueName }) => ({
    url: `/queues/${queueName}/jobs/${jobId}`,
    method: 'GET',
  }));
  const { jobId, queueName } = match.params;
  useEffect(() => getJob({ jobId, queueName }), [jobId, queueName, getJob]);

  return (
    <div>
      <Typography variant="h4">Error Stack</Typography>
      <List>
        {(job.data?.stacktrace || []).map(trace => (
          <ListItem key={trace}>
            <pre>{trace}</pre>
          </ListItem>
        ))}
      </List>
      <pre>{JSON.stringify(job?.data, null, 2)}</pre>
    </div>
  );
};

Job.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      jobId: PropTypes.string,
      queueName: PropTypes.string,
    }),
  }).isRequired,
};

export default Job;
