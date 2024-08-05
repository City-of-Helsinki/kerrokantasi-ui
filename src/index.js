import { render } from 'react-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as Sentry from '@sentry/react';

import getRoot from './getRoot';
import createStore from './createStore';
import commonInit from './commonInit';
import config from './config';
// eslint-disable-next-line import/no-unresolved
import '@city-assets/sass/app.scss';

require('es6-promise').polyfill();

commonInit(() => {
  if (config.uiConfig && config.uiConfig.sentryDns && config.uiConfig.sentryEnvironment) {
    Sentry.init({
      dsn: config.uiConfig.sentryDns,
      environment: config.uiConfig.sentryEnvironment,
      integrations: [Sentry.browserTracingIntegration()],
      tracesSampleRate: 1.0,
      ignoreErrors: [
        'ResizeObserver loop completed with undelivered notifications',
        'ResizeObserver loop limit exceeded',
      ],
    })
  };

  const store = createStore(typeof window !== 'undefined' ? window.STATE : {});
  const root = getRoot(store);
  render(root, document.getElementById('root'));
});
