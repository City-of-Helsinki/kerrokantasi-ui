import { configureStore } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import * as Sentry from '@sentry/react';

import hearingEditorMiddleware from './middleware/hearingEditor';
import rootReducer from './reducers';

export const history = createBrowserHistory();

export default function createAppStore(initialState = null) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState || {},
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['receiveOidcUserData'],
          ignoredPaths: ['oidc.user'],
        },
        immutableCheck: {
          ignoredPaths: ['oidc.user'],
        },
      }).concat(...hearingEditorMiddleware),
    enhancers: (getDefaultEnhancers) =>
      getDefaultEnhancers().concat(Sentry.createReduxEnhancer()),
  });
}
