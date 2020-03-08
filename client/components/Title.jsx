import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

export default function Title({ children, ...rest }) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom {...rest}>
      {children}
    </Typography>
  );
}

Title.propTypes = {
  children: PropTypes.node,
};

Title.defaultProps = {
  children: null,
};
