/* eslint-disable prefer-arrow-callback */
// Init to be run both on server and client

import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fi from 'react-intl/locale-data/fi';
import sv from 'react-intl/locale-data/sv';
import noop from 'lodash/noop';

let done = false;

function addLocaleDatas() {
  addLocaleData(en);
  addLocaleData(fi);
  addLocaleData(sv);
}

export default function commonInit(cb = noop) {
  if (done) {
    return;
  }
  done = true;
  if (!global.Intl) {
    // see https://github.com/andyearnshaw/Intl.js#intljs-and-browserifywebpack
    require.ensure(['intl'], function installIntl(require) {
      global.Intl = require('intl');
      addLocaleDatas();
      cb();
    });
  } else {
    addLocaleDatas();
    cb();
  }
}
