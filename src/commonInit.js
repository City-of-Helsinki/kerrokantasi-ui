/* eslint-disable prefer-arrow-callback */
// Init to be run both on server and client

import {addLocaleData} from 'react-intl';
import en from 'react-intl/locale-data/en';
import fi from 'react-intl/locale-data/fi';
import sv from 'react-intl/locale-data/sv';
import noop from 'lodash/noop';

let done = false;

export default function commonInit(cb = noop) {
  if (done) {
    return;
  }
  addLocaleData(en);
  addLocaleData(fi);
  addLocaleData(sv);
  done = true;
  if (!global.Intl && require.ensure) {
    // see https://github.com/andyearnshaw/Intl.js#intljs-and-browserifywebpack
    require.ensure(['intl'], function installIntl(require) {
      global.Intl = require('intl');
      cb();
    });
  } else {
    cb();
  }
}
