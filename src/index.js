import * as Sentry from '@sentry/react';
/* eslint-disable import-x/no-unresolved */
import { createRoot } from 'react-dom/client';

import getRoot from './getRoot';
import createStore from './createStore';
import config from './config';
import '@city-assets/sass/app.scss';
import { beforeSend, beforeSendTransaction } from './utils/sentry';

if (config.sentryDsn && config.sentryEnvironment) {
  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.sentryEnvironment,
    release: config.sentryRelease,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: config.sentryTracesSampleRate,
    tracePropagationTargets: config.sentryTracePropagationTargets,
    replaysSessionSampleRate: config.sentryReplaysSessionSampleRate,
    replaysOnErrorSampleRate: config.sentryReplaysOnErrorSampleRate,
    ignoreErrors: [
      'ResizeObserver loop completed with undelivered notifications',
      'ResizeObserver loop limit exceeded',
      // Generic network noise: transient connectivity issues, not actionable app bugs.
      // Users already get a localized error toast via requestErrorHandler.
      'Failed to fetch',
      'Load failed',
      'NetworkError when attempting to fetch resource',
      // Browser/runtime resource exhaustion, not something the app can prevent
      'NS_ERROR_OUT_OF_MEMORY',
      // hds-react CookieSettingsPage crashes when indexedDB/localStorage is blocked
      // (privacy modes, some mobile browsers)
      "Can't find variable: indexedDB",
      'indexedDB is not defined',
      "Cannot read properties of null (reading 'getItem')",
      'Cannot convert undefined or null to object',
      'UnknownError: Internal error.',
      // Leaflet internals occasionally run addClass/_zoomOut on an element removed mid-animation
      "undefined is not an object (evaluating 'e.classList')",
      "Cannot read properties of null (reading '_zoom')",
      "Cannot read properties of null (reading 'children')",
      'Map container is already initialized',
      // React-DOM commit-phase race when a node's already been removed from the DOM
      "Failed to execute 'removeChild' on 'Node'",
      // Android WebView JS bridge dropped its Java-side counterpart (embedded app view)
      'Error invoking postMessage',
      // Stale JS/CSS chunk references after a new deploy; handled by chunk-reload logic
      'Failed to fetch dynamically imported module',
      'error loading dynamically imported module',
      'Importing a module script failed',
      'Unable to preload CSS for',
    ],
    beforeSend,
    beforeSendTransaction,
  });
}

const store = createStore();
const app = getRoot(store);
const container = document.getElementById('root');
const root = createRoot(container);
root.render(app);
