import {compose, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {localizedNotifyError} from './utils/notify';
import rootReducer from './reducers';
import hearingEditorMiddleware from './middleware/hearingEditor';

import identity from 'lodash/identity';
import {routerMiddleware} from 'react-router-redux';
import { createBrowserHistory } from 'history';
import config from './config';
import RavenMiddleWare from 'redux-raven-middleware';
import languageMiddleware from './middleware/language';
import headlessMiddleware from './middleware/headless';

export const history = createBrowserHistory();

const middleware = [
  thunk,
  routerMiddleware(history),
  languageMiddleware,
  headlessMiddleware,
  ...hearingEditorMiddleware];
if (config.uiConfig && config.uiConfig.sentryDns) {
  middleware.unshift(RavenMiddleWare(
    config.uiConfig.sentryDns,
    null,
    {logger: () => localizedNotifyError("APICallFailed")}
  ));
}

if (typeof window !== 'undefined') {
  if (!(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test')) {
    middleware.push(require('redux-logger')());
  }
}

export default function createAppStore(initialState = null) {
  // Have to pass in the router to support isomorphic rendering
  const augmentedCreateStore = compose(
    applyMiddleware(...middleware),
    typeof window !== 'undefined' && window.devToolsExtension ? window.devToolsExtension() : identity,
  )(createStore);
  return augmentedCreateStore(rootReducer, initialState || {});
}
