import React from 'react';
import PropTypes from 'prop-types';
import red from '@material-ui/core/colors/red';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import indigo from '@material-ui/core/colors/indigo';
import orange from '@material-ui/core/colors/orange';
import lightBlue from '@material-ui/core/colors/lightBlue';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  chip: {
    background: 'transparent',
    cursor: 'inherit',
  },
  active: {
    background: purple[100],
  },
  completed: {
    background: green[100],
  },
  delayed: {
    background: indigo[100],
  },
  failed: {
    background: red[100],
  },
  paused: {
    background: orange[100],
  },
  waiting: {
    background: lightBlue[100],
  },
}));

const ucFirst = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const Status = ({ status, count }) => {
  const classes = useStyles();

  return (
    <Chip
      className={classes.chip}
      label={ucFirst(status)}
      avatar={<Avatar className={classes[status]}>{count}</Avatar>}
    />
  );
};

Status.propTypes = {
  count: PropTypes.number,
  status: PropTypes.oneOf([
    'active',
    'completed',
    'delayed',
    'failed',
    'paused',
    'waiting',
  ]).isRequired,
};

Status.defaultProps = {
  count: 0,
};

export default Status;
