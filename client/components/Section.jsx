import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}));

const Section = ({ children, ...rest }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.paper} {...rest}>
      {children}
    </Paper>
  );
};

Section.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Section;
