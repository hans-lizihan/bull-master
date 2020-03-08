/* eslint-disable import/no-extraneous-dependencies */
// https://github.com/facebook/jest/issues/4545
// eslint-disable-next-line func-names
global.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0);
};

global.localStorage = {
  getItem: () => {},
  setItem: () => {},
};

const { configure } = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

configure({ adapter: new Adapter() });
