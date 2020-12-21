import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import MuiCircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  top: {
    color: '#eef3fd',
  },
  bottom: {
    color: theme.primary,
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
  text: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
  },
}));

const CircularProgress = ({ value, size, ...rest }) => {
  const classes = useStyles();
  return (
    <div className={classes.root} style={{ height: size, width: size }}>
      <MuiCircularProgress
        variant="determinate"
        value={100}
        className={classes.top}
        size={size}
        thickness={4}
        {...rest}
      />
      <MuiCircularProgress
        variant="static"
        className={classes.bottom}
        size={size}
        thickness={4}
        value={value}
        {...rest}
      />
      <Typography className={classes.text}>{value}%</Typography>
    </div>
  );
};

CircularProgress.propTypes = {
  value: PropTypes.number,
  size: PropTypes.number,
};

CircularProgress.defaultProps = {
  value: 0,
  size: 48,
};

export default CircularProgress;
