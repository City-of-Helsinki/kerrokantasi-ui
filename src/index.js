import * as Sentry from '@sentry/react';
/* eslint-disable import/no-unresolved */
import { createRoot } from 'react-dom/client'

import getRoot from './getRoot';
import createStore from './createStore';
import commonInit from './commonInit';
import config from './config';
import '@city-assets/sass/app.scss';
import '@formatjs/intl-relativetimeformat/polyfill'
import { beforeSend, beforeSendTransaction } from './utils/sentry';

commonInit(function initReady() {
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
      ],
      beforeSend,
      beforeSendTransaction
    })
  };
  const store = createStore(typeof window !== 'undefined' ? window.STATE : {});
  const app = getRoot(store);
  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(app)
});
