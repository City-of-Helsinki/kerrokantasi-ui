/* eslint-disable no-empty */
try {
  require('heapdump'); // eslint-disable-line import/no-extraneous-dependencies, import/no-unresolved
} catch (exc) {
}

require('babel-register');
require('./bootstrap').default();
