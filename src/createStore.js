/* eslint-disable no-underscore-dangle */
import identity from 'lodash/identity';
import { thunk } from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { wrapHistory } from "oaf-react-router";
import { compose, createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';

import headlessMiddleware from './middleware/headless';
import hearingEditorMiddleware from './middleware/hearingEditor';
import languageMiddleware from './middleware/language';
import rootReducer from './reducers';

export const history = createBrowserHistory();

const historySettings = {
  // eslint-disable-next-line no-unused-vars
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

export default function createAppStore(initialState = null) {
  // Have to pass in the router to support isomorphic rendering
  const augmentedCreateStore = compose(
    applyMiddleware(...middleware),
    typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__() : identity,
  )(createStore);
  return augmentedCreateStore(rootReducer, initialState || {});
}
