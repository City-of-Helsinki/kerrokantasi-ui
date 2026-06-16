import { configureStore } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import * as Sentry from '@sentry/react';

import headlessMiddleware from './middleware/headless';
import hearingEditorMiddleware from './middleware/hearingEditor';
import languageMiddleware from './middleware/language';
import rootReducer from './reducers';

export const history = createBrowserHistory();

export default function createAppStore(initialState = null) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState || {},
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        languageMiddleware,
        headlessMiddleware,
        ...hearingEditorMiddleware
      ),
    enhancers: (getDefaultEnhancers) =>
      getDefaultEnhancers().concat(Sentry.createReduxEnhancer()),
  });
}
