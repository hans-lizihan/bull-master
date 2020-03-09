/* eslint-disable import/first */
const { basePath } = window;
// eslint-disable-next-line
__webpack_public_path__ = `${basePath}/`;

import React from 'react';
import { render } from 'react-dom';
import App from './App';

render(<App basePath={basePath} />, document.getElementById('root'));
