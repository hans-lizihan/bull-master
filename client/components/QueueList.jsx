import React from 'react';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import indigo from '@material-ui/core/colors/indigo';
import orange from '@material-ui/core/colors/orange';
import lightBlue from '@material-ui/core/colors/lightBlue';
import { makeStyles } from '@material-ui/core/styles'
import Title from './Title'

const useStyles= makeStyles((theme) => ({
  chip: {
    background: theme.palette.common.white,
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

const QueueList = ({ queues }) => {
  const classes = useStyles();

  return queues.map(({ name, counts: { active, completed, delayed, paused, waiting }}) => (
    <Card key={name} style={{marginBottom: 12}}>
      <CardActionArea component={Link} to={`/queues/${name}`}>
        <CardContent>
          <Title gutterBottom>
            {name}
          </Title>
          <Chip className={classes.chip} label="Active" avatar={<Avatar className={classes.active}>{active}</Avatar>} />
          <Chip className={classes.chip} label="Completed" avatar={<Avatar className={classes.completed}>{completed}</Avatar>} />
          <Chip className={classes.chip} label="Delayed" avatar={<Avatar className={classes.delayed}>{delayed}</Avatar>} />
          <Chip className={classes.chip} label="Paused" avatar={<Avatar className={classes.paused}>{paused}</Avatar>} />
          <Chip className={classes.chip} label="Failed" avatar={<Avatar className={classes.failed}>{paused}</Avatar>} />
          <Chip className={classes.chip} label="Waiting" avatar={<Avatar className={classes.waiting}>{waiting}</Avatar>} />
        </CardContent>
      </CardActionArea>
    </Card>
  ))
};

QueueList.propTypes = {
  queues: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    counts: PropTypes.shape({
      active: PropTypes.number,
      completed: PropTypes.number,
      failed: PropTypes.number,
      delayed: PropTypes.number,
      paused: PropTypes.number,
      waiting: PropTypes.number,
    })
  }))
};

QueueList.defaultProps = {
  queues: [],
};

export default QueueList;
