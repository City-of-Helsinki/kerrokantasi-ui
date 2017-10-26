/* eslint-disable prefer-arrow-callback */
import 'alertifyjs/build/css/alertify.css';
import '../assets/sass/app.scss';
import {render} from 'react-dom';
import getRoot from './getRoot';
import createStore from './createStore';
import commonInit from './commonInit';
import config from './config';
import Raven from 'raven-js';

require('es6-promise').polyfill();

commonInit(function initReady() {
  try {
    if (config.uiConfig && config.uiConfig.sentryDns) Raven.config(config.uiConfig.sentryDns).install();
  } catch (err) {
    console.log(err);
  }
  const store = createStore(typeof window !== 'undefined' ? window.STATE : {});
  const root = getRoot(store);
  render(root, document.getElementById('root'));
});
