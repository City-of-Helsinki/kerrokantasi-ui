/* eslint-disable prefer-arrow-callback */
import { render } from 'react-dom';
import Raven from 'raven-js';
import { loadUser } from "redux-oidc";

import getRoot from './getRoot';
import createStore from './createStore';
import commonInit from './commonInit';
import config from './config';
// eslint-disable-next-line import/no-unresolved
import '@city-assets/sass/app.scss';
import userManager from "./utils/userManager";

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
  loadUser(store, userManager);
  render(root, document.getElementById('root'));
});
