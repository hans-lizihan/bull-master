import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { useResource } from 'react-request-hook';
import useInterval from '../hooks/useInterval';
import Section from '../components/Section';
import Title from '../components/Title';

const Queue = ({ match }) => {
  const [queue, getQueue] = useResource(() => ({
    url: `/queues/${match.params.queueName}`,
    method: 'GET',
  }));
  useInterval(getQueue, 4000);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Section>
          <Title>{queue.data?.name}</Title>
        </Section>
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
