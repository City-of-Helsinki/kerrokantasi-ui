import Helmet from 'react-helmet';
import React from 'react';
import {Provider} from 'react-redux';
import {match, reduxReactRouter} from 'redux-router/server';
import {renderToStaticMarkup, renderToString} from 'react-dom/server';
import createMemoryHistory from 'history/lib/createMemoryHistory';

import commonInit from '../src/commonInit';
import routes from '../src/routes';
import createStore from '../src/createStore';
import getRoot from '../src/getRoot';
import Html from './Html';

// Pilfered from https://github.com/rackt/react-router/blob/master/docs/guides/advanced/ServerRendering.md
//           and https://github.com/nfl/react-helmet#server-usage
//           and https://github.com/rackt/redux-router/commit/c1c737faf8fb7bc9426d5d7828d265d3e19aeed4

export default function render(req, res, settings) {
  const bundleSrc = settings.bundleSrc || "/app.js";
  if (!settings.serverRendering) {
    const html = renderToStaticMarkup((<Html bundleSrc={bundleSrc}/>));
    res.status(200).send(html);
    return;
  }

  if (!settings.dev || !settings.bundleSrc) { // Compilation not ready yet
    res.status(503).send("Initializing. Please try again soon.");
  }

  // This initialization segment here mirrors what's done in `src/index.js` for client-side:
  commonInit();
  const store = createStore(reduxReactRouter, createMemoryHistory, {});

  // And this bit replaces the actual React mounting.
  // TODO: do async actions before rendering (see https://github.com/rackt/redux/issues/99)
  store.dispatch(match(req.url, (error, redirectLocation, routerState) => {
    if (error) {
      res.status(500).send(error.message);
      return;
    }
    if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      return;
    }

    const appContent = renderToString(getRoot(store));
    const state = {}; // TODO: Should probably use store.getState(), but it seems to break things
    const head = Helmet.rewind();
    const html = renderToStaticMarkup((<Html
      head={head}
      content={appContent}
      initialState={state}
      bundleSrc={bundleSrc}
    />));
    res.status(200).send(html);
  }));
}
