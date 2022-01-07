import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root';
import { ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { RequestProvider } from 'react-request-hook';
import client from './network/client';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import Queue from './pages/Queue';
import Job from './pages/Job';
import theme from './theme';

function App({ basePath }) {
  return (
    <ThemeProvider theme={theme}>
      <RequestProvider value={client}>
        <Router basename={basePath}>
          <Layout>
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route exact path="/queues/:queueName" component={Queue} />
              <Route exact path="/queues/:queueName/:jobId" component={Job} />
            </Switch>
          </Layout>
        </Router>
      </RequestProvider>
    </ThemeProvider>
  );
}

App.propTypes = {
  basePath: PropTypes.string.isRequired,
};

export default hot(App);
