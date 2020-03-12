import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Status from '../components/Status';

const StatusTabs = ({ counts, value, onChange }) => {
  const { active, completed, delayed, failed, paused, waiting } = counts || {};
  return (
    <AppBar position="static" color="default">
      <Tabs
        value={value}
        onChange={onChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab value="active" label={<Status status="active" count={active} />} />
        <Tab
          value="completed"
          label={<Status status="completed" count={completed} />}
        />
        <Tab
          value="delayed"
          label={<Status status="delayed" count={delayed} />}
        />
        <Tab value="paused" label={<Status status="paused" count={paused} />} />
        <Tab value="failed" label={<Status status="failed" count={failed} />} />
        <Tab
          value="waiting"
          label={<Status status="waiting" count={waiting} />}
        />
      </Tabs>
    </AppBar>
  );
};

StatusTabs.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  counts: PropTypes.shape({
    active: PropTypes.number,
    completed: PropTypes.number,
    delayed: PropTypes.number,
    failed: PropTypes.number,
    paused: PropTypes.number,
    waitin: PropTypes.number,
  }),
};

StatusTabs.defaultProps = {
  counts: {},
};

export default StatusTabs;
