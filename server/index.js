/* eslint-disable no-empty */
try { require('heapdump'); } catch (exc) { }

require('babel-register');
require('app-module-path').addPath(require('path').resolve(__dirname, "..", "src"));
require('./bootstrap');
