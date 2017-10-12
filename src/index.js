/* eslint-disable prefer-arrow-callback */
import 'alertifyjs/build/css/alertify.css';
import '../assets/sass/app.scss';
import {render} from 'react-dom';
import getRoot from './getRoot';
import createStore from './createStore';
import commonInit from './commonInit';
import createBrowserHistory from 'history/lib/createBrowserHistory';

require('es6-promise').polyfill();

commonInit(function initReady() {
  const store = createStore(createBrowserHistory, typeof window !== 'undefined' ? window.STATE : {});
  const root = getRoot(store);
  render(root, document.getElementById('root'));
});
