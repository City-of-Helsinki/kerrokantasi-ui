import 'assets/app.less';
import {render} from 'react-dom';
import getRoot from './getRoot';
import createStore from './createStore';
import commonInit from './commonInit';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import {reduxReactRouter} from 'redux-router';

commonInit();
const store = createStore(
  reduxReactRouter,
  createBrowserHistory,
  (typeof window !== "undefined" ? window.STATE : {})
);
const root = getRoot(store);
render(root, document.getElementById('root'));
