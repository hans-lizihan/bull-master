import React from 'react';
import PropTypes from 'prop-types';
import formatBytes from 'pretty-bytes';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import RedisLogo from './RedisLogo';
import Title from './Title';

const getMemoryUsage = (usedMemory, totalSystemMemory) => {
  if (!usedMemory) {
    return '-';
  }
  const usedMemoryNumber = parseInt(usedMemory, 10);

  if (!totalSystemMemory) {
    return formatBytes(parseInt(usedMemory, 10));
  }
  const totalSystemMemoryNumber = parseInt(totalSystemMemory, 10);

  return `${((usedMemoryNumber / totalSystemMemoryNumber) * 100).toFixed(2)}%`;
};

function RedisStats({ stats }) {
  const {
    redisVersion,
    usedMemory,
    totalSystemMemory,
    memFragmentationRatio,
    connectedClients,
    blockedClients,
  } = stats || {};

  return (
    <Grid container>
      <Grid item xs={2} container justify="center" alignItems="center">
        <RedisLogo />
      </Grid>
      <Grid item xs={2}>
        <Title component="h3" variant="subtitle2">
          Version
        </Title>
        <Title component="div" variant="h4">
          {redisVersion}
        </Title>
      </Grid>
      <Grid item xs={2}>
        <Title component="h3" variant="subtitle2">
          Memory Usage
        </Title>
        <Title component="div" variant="h4" gutterBottom={false}>
          {getMemoryUsage(usedMemory, totalSystemMemory)}
        </Title>
        {totalSystemMemory && usedMemory ? (
          <Typography variant="body2">
            ({formatBytes(parseInt(usedMemory, 10))} of{' '}
            {formatBytes(parseInt(totalSystemMemory, 10))})
          </Typography>
        ) : (
          <Typography variant="body2" color="error">
            Could not retrieve memory stats
          </Typography>
        )}
      </Grid>

      <Grid item xs={2}>
        <Title component="h3" variant="subtitle2">
          Fragmentation Ratio
        </Title>
        <Title component="div" variant="h4">
          {memFragmentationRatio}
        </Title>
      </Grid>

      <Grid item xs={2}>
        <Title component="h3" variant="subtitle2">
          Connected Clients
        </Title>
        <Title component="div" variant="h4">
          {connectedClients}
        </Title>
      </Grid>

      <Grid item xs={2}>
        <Title component="h3" variant="subtitle2">
          Blocked Clients
        </Title>
        <Title component="div" variant="h4">
          {blockedClients}
        </Title>
      </Grid>
    </Grid>
  );
}

RedisStats.propTypes = {
  stats: PropTypes.shape({
    redisVersion: PropTypes.string,
    usedMemory: PropTypes.string,
    totalSystemMemory: PropTypes.string,
    memFragmentationRatio: PropTypes.string,
    connectedClients: PropTypes.string,
    blockedClients: PropTypes.string,
  }),
};

RedisStats.defaultProps = {
  stats: {},
};

export default RedisStats;
