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
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  chip: {
    background: 'transparent',
    cursor: 'inherit',
  },
  avartar: {
    minWidth: '24px !important',
    width: 'auto !important',
    padding: '0 3px 0 3px',
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

const hasCount = count => {
  if (!count && count !== 0) {
    return false;
  }
  return true;
};

const Status = ({ status, count, ...rest }) => {
  const classes = useStyles();

  return (
    <Chip
      className={clsx({
        [classes.chip]: hasCount(count),
        [classes[status]]: !hasCount(count),
      })}
      label={ucFirst(status)}
      avatar={
        hasCount(count) ? (
          <Avatar className={clsx(classes[status], classes.avartar)}>
            {count}
          </Avatar>
        ) : null
      }
      {...rest}
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
  ]),
};

Status.defaultProps = {
  count: null,
  status: 'completed',
};

export default Status;
