import Helmet from 'react-helmet';
import React from 'react';
import {Provider} from 'react-redux';
import {match, reduxReactRouter} from 'redux-router/server';
import {renderToStaticMarkup, renderToString} from 'react-dom/server';
import createMemoryHistory from 'history/lib/createMemoryHistory';
import flatten from 'lodash/array/flatten';
import compact from 'lodash/array/compact';

import commonInit from '../src/commonInit';
import routes from '../src/routes';
import createStore from '../src/createStore';
import getRoot from '../src/getRoot';
import Html from './Html';

// Pilfered from https://github.com/rackt/react-router/blob/master/docs/guides/advanced/ServerRendering.md
//           and https://github.com/nfl/react-helmet#server-usage
//           and https://github.com/rackt/redux-router/commit/c1c737faf8fb7bc9426d5d7828d265d3e19aeed4
//           and https://github.com/erikras/react-redux-universal-hot-example/blob/61610b154fa82d274d89f6cd1f0818edce5a8f6c/src/server.js

function getStatusFromRoutes(matchedRoutes) {
  return matchedRoutes.reduce((prev, cur) => cur.status || prev, null);
}

function getDataDependencies(store) {
  // Get an array of data-fetching promises for the store/router state.
  // The promises will have been primed at this point, so some network activity
  // will occur.
  const {getState, dispatch} = store;
  const {location, params, components} = getState().router;
  const fetchers = [];
  function getFetchers(component) {
    const fetcher = component.fetchData;
    if(fetcher && typeof fetcher == 'function') fetchers.push(fetcher);
    if(component.WrappedComponent) { // `react-redux` convention; dive in.
      getFetchers(component.WrappedComponent);
    }
    // TODO: `react-intl` support waits for https://github.com/yahoo/react-intl/pull/219
  }
  components.forEach(getFetchers);
  if(!fetchers.length) return [];
  return compact(flatten(fetchers.map(fetchData => fetchData(dispatch, getState, location, params))));
}

function renderState(store, routerState, bundleSrc="/app.js") {
  return new Promise(function (resolve, reject) {
    // Workaround redux-router query string issue: https://github.com/rackt/redux-router/issues/106
    if (routerState.location.search && !routerState.location.query) {
      routerState.location.query = qs.parse(routerState.location.search);
    }
    const promises = getDataDependencies(store);
    Promise.all(promises).then(() => {
      const status = getStatusFromRoutes(routerState.routes);
      const appContent = renderToString(getRoot(store));
      const state = {}; // TODO: Should probably use store.getState(), but it seems to break things
      const head = Helmet.rewind();
      const html = renderToStaticMarkup((<Html
        head={head}
        content={appContent}
        initialState={state}
        bundleSrc={bundleSrc}
      />));
      resolve({status, html});
    }).catch((err) => {
      reject(err);
    });
  });
}

export default function render(req, res, settings) {
  const bundleSrc = settings.bundleSrc || "/app.js";
  if (!settings.serverRendering) {
    const html = renderToStaticMarkup((<Html bundleSrc={bundleSrc}/>));
    res.status(200).send(html);
    return;
  }

  if (!settings.dev && !settings.bundleSrc) { // Compilation not ready yet
    res.status(503).send("Initializing. Please try again soon.");
  }

  // This initialization segment here mirrors what's done in `src/index.js` for client-side:
  commonInit();
  const store = createStore(reduxReactRouter, createMemoryHistory, {});

  // And this bit replaces the actual React mounting.
  store.dispatch(match(req.url, (error, redirectLocation, routerState) => {
    if (error) {
      res.status(500).send(error.message);
      return;
    }
    if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      return;
    }
    renderState(store, routerState, bundleSrc).then(({status, html}) => {
      res.status(status || 200).send(html);
    }, (err) => {
      res.status(500).send(err);
    });
  }));
}
