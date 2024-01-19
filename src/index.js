/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-arrow-callback */
import { render } from 'react-dom';
import Raven from 'raven-js';

import getRoot from './getRoot';
import createStore from './createStore';
import commonInit from './commonInit';
import config from './config';
import '@city-assets/sass/app.scss';

require('es6-promise').polyfill();

commonInit(function initReady() {
  try {
    if (config.uiConfig && config.uiConfig.sentryDns) Raven.config(config.uiConfig.sentryDns).install();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  const store = createStore(typeof window !== 'undefined' ? window.STATE : {});
  const root = getRoot(store);
  render(root, document.getElementById('root'));
});
