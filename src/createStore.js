/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
import RavenMiddleWare from 'redux-raven-middleware';
import identity from 'lodash/identity';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { wrapHistory } from "oaf-react-router";
import { compose, createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';

import config from './config';
import headlessMiddleware from './middleware/headless';
import hearingEditorMiddleware from './middleware/hearingEditor';
import languageMiddleware from './middleware/language';
import rootReducer from './reducers';
import { localizedNotifyError } from './utils/notify';

export const history = createBrowserHistory();

const historySettings = {
  documentTitle: (location) => document.title || "Kerrokantasi",
  announcePageNavigation: false, // default true
  setPageTitle: false,
  primaryFocusTarget: "body",
};

wrapHistory(history, historySettings);

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
    { logger: () => localizedNotifyError("APICallFailed") }
  ));
}

export default function createAppStore(initialState = null) {
  // Have to pass in the router to support isomorphic rendering
  const augmentedCreateStore = compose(
    applyMiddleware(...middleware),
    typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__() : identity,
  )(createStore);
  return augmentedCreateStore(rootReducer, initialState || {});
}
