/* eslint-disable prefer-arrow-callback */
import '../assets/less/app.less';
import 'alertifyjs/build/css/alertify.css';
import 'alertifyjs/build/css/themes/default.css';
import {render} from 'react-dom';
import getRoot from './getRoot';
import createStore from './createStore';
import commonInit from './commonInit';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import {reduxReactRouter} from 'redux-router';

require('es6-promise').polyfill();


commonInit(function initReady() {
  const store = createStore(
    reduxReactRouter,
    createBrowserHistory,
    (typeof window !== "undefined" ? window.STATE : {})
  );
  const root = getRoot(store);
  render(root, document.getElementById('root'));
});
