/* eslint-disable max-len */
import Helmet from 'react-helmet';
import React from 'react';
import {match, reduxReactRouter} from 'redux-router/server';
import {renderToStaticMarkup, renderToString} from 'react-dom/server';
import createMemoryHistory from 'history/lib/createMemoryHistory';
import flatten from 'lodash/flatten';
import compact from 'lodash/compact';
import qs from 'query-string';
import url from 'url';

import commonInit from '../src/commonInit';
import createStore from '../src/createStore';
import getRoot from '../src/getRoot';
import Html from './Html';

// Pilfered from:
// * https://github.com/rackt/react-router/blob/master/docs/guides/advanced/ServerRendering.md
// * https://github.com/nfl/react-helmet#server-usage
// * https://github.com/rackt/redux-router/commit/c1c737faf8fb7bc9426d5d7828d265d3e19aeed4
// * https://github.com/erikras/react-redux-universal-hot-example/blob/61610b154fa82d274d89f6cd1f0818edce5a8f6c/src/server.js

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
  const assurers = [];

  function getFetchers(component) {
    const fetcher = component.fetchData;
    const assurer = component.canRenderFully;
    if (fetcher && typeof fetcher === 'function') fetchers.push(fetcher);
    if (assurer && typeof assurer === 'function') assurers.push(assurer);
    if (component.WrappedComponent) { // `react-redux` convention; dive in.
      getFetchers(component.WrappedComponent);
    }
    // TODO: `react-intl` support waits for https://github.com/yahoo/react-intl/pull/219
  }

  components.forEach(getFetchers);
  if (!fetchers.length) return [];
  if (assurers.length) { // See if we have any rendering assurers; if we do...
    // ... see whether they all assure us that they can render their respective views...
    const allAssured = assurers.map(canRenderFully => canRenderFully(getState, location, params)).every((flag) => !!flag);
    if (allAssured) { // ... and if they do, don't even bother with the actual fetchers.
      return [];
    }
  }
  return compact(flatten(fetchers.map(fetchData => fetchData(dispatch, getState, location, params))));
}

function renderState(settings, store, routerState, bundleSrc = "/app.js") {
  return new Promise((resolve, reject) => {
    // Workaround redux-router query string issue: https://github.com/rackt/redux-router/issues/106
    if (routerState.location.search && !routerState.location.query) {
      routerState.location.query = qs.parse(routerState.location.search);  // eslint-disable-line no-param-reassign
    }
    const promises = getDataDependencies(store);
    Promise.all(promises).then(() => {
      try {
        const status = getStatusFromRoutes(routerState.routes);
        const appContent = renderToString(getRoot(store));
        const state = {}; // TODO: Should probably use store.getState(), but it seems to break things
        const head = Helmet.rewind();
        const html = renderToStaticMarkup((<Html
          head={head}
          content={appContent}
          initialState={state}
          bundleSrc={bundleSrc}
          apiBaseUrl={settings.apiBaseUrl}
          uiConfig={settings.uiConfig}
        />));
        resolve({status, html});
      } catch(err) {
        console.log(err);
        throw err;
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

export default function render(req, res, settings, initialState = {}) {
  const bundleSrc = settings.bundleSrc || "/app.js";
  if (!settings.serverRendering) {
    const html = renderToStaticMarkup((<Html
      bundleSrc={bundleSrc}
      apiBaseUrl={settings.apiBaseUrl}
      uiConfig={settings.uiConfig}
    />));
    res.status(200).send(html);
    return;
  }

  if (!settings.dev && !settings.bundleSrc) { // Compilation not ready yet
    res.status(503).send("Initializing. Please try again soon.");
    return;
  }

  // Hook up the global `HOSTNAME` for sharing usage:
  const parsedUrl = url.parse(settings.publicUrl || "http://localhost:8086/");
  global.HOSTNAME = parsedUrl.protocol + "://" + parsedUrl.host;

  // This initialization segment here mirrors what's done in `src/index.js` for client-side:
  commonInit();
  const store = createStore(reduxReactRouter, createMemoryHistory, initialState);

  // And this bit replaces the actual React mounting.
  store.dispatch(match(req.url, (error, redirectLocation, routerState) => {
    if (error) {
      console.log('1', error);
      console.trace();
      res.status(500).send(error.message);
      return;
    }
    if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      return;
    }
    renderState(settings, store, routerState, bundleSrc).then(({status, html}) => {
      res.status(status || 200).send(html);
    }, (err) => {
      console.log('2', err);
      console.trace();
      res.status(500).send(err);
    });
  }));
}
