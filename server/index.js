/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
/* eslint-disable no-empty */
try {
  require('heapdump');
} catch (exc) {
}

require('@babel/register');
require('./bootstrap').default();
