import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Title from './Title';
import Status from './Status';

const QueueList = ({ queues }) =>
  queues.map(
    ({
      name,
      counts: { active, completed, delayed, failed, paused, waiting },
    }) => (
      <Card key={name} style={{ marginBottom: 12 }}>
        <CardActionArea component={Link} to={`/queues/${name}`}>
          <CardContent>
            <Title gutterBottom>{name}</Title>
            <Status status="active" count={active} />
            <Status status="completed" count={completed} />
            <Status status="delayed" count={delayed} />
            <Status status="paused" count={paused} />
            <Status status="failed" count={failed} />
            <Status status="waiting" count={waiting} />
          </CardContent>
        </CardActionArea>
      </Card>
    ),
  );

QueueList.propTypes = {
  queues: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      counts: PropTypes.shape({
        active: PropTypes.number,
        completed: PropTypes.number,
        failed: PropTypes.number,
        delayed: PropTypes.number,
        paused: PropTypes.number,
        waiting: PropTypes.number,
      }),
    }),
  ),
};

QueueList.defaultProps = {
  queues: [],
};

export default QueueList;
