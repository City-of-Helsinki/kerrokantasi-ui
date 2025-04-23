// Init to be run both on server and client
import noop from 'lodash/noop';

let done = false;

export default function commonInit(cb = noop) {
  if (done) {
    return;
  }
  done = true;
  if (!global.Intl) {
    // see https://github.com/andyearnshaw/Intl.js#intljs-and-browserifywebpack
    require.ensure(['intl'], function installIntl(require) {
      global.Intl = require('intl');
      cb();
    });
  } else {
    cb();
  }
}
