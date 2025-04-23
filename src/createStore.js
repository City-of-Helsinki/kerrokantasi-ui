/* eslint-disable no-underscore-dangle */
import identity from 'lodash/identity';
import { thunk } from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { compose, createStore, applyMiddleware } from 'redux';
import * as Sentry from "@sentry/react";

import headlessMiddleware from './middleware/headless';
import hearingEditorMiddleware from './middleware/hearingEditor';
import languageMiddleware from './middleware/language';
import rootReducer from './reducers';

export const history = createBrowserHistory();


const middleware = [
  thunk,
  languageMiddleware,
  headlessMiddleware,
  ...hearingEditorMiddleware];

export default function createAppStore(initialState = null) {
  const sentryReduxEnhancer = Sentry.createReduxEnhancer();

  // Have to pass in the router to support isomorphic rendering
  const augmentedCreateStore = compose(
    applyMiddleware(...middleware),
    sentryReduxEnhancer,
    typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__() : identity,
  )(createStore);
  return augmentedCreateStore(rootReducer, initialState || {});
}
