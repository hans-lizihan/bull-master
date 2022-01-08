import React from 'react';
import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root';
import { ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
            <Routes>
              <Route exact path="/" element={<Dashboard />} />
              <Route exact path="/queues/:queueName" element={<Queue />} />
              <Route exact path="/queues/:queueName/:jobId" element={<Job />} />
            </Routes>
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
