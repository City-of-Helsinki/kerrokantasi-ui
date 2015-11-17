import assign from 'lodash/object/assign';
import noop from 'lodash/utility/noop';
import commonInit from 'commonInit';
import createMemoryHistory from 'history/lib/createMemoryHistory';
import createStore from 'createStore';
import messages from 'i18n';
import React from 'react';
import express from 'express';
import {createRenderer} from 'react-addons-test-utils';
import {IntlProvider} from 'react-intl';
import {Provider} from 'react-redux';
import {reduxReactRouter} from 'redux-router';
import {jsdom} from 'jsdom';
import Response from 'node-fetch/lib/response';
import {Readable} from 'stream';

export const mockUser = {id: "fff", displayName: "Mock von User"};

/**
 * Wire a component class up with Redux and React-Intl for testing.
 * Because there doesn't seem to be a good way to pass context down, the returned
 * element is not directly the type passed in.
 *
 * @param store Store (or initial state object implicitly converted to a store)
 * @param type Element type
 * @param props Element props
 * @param children Element children
 */
export function wireComponent(store, type, props = {}, children = []) {
  if (typeof store.getState !== "function") {  // Doesn't quack like a store
    store = createTestStore(store);
  }
  const locale = store.getState().language || "fi";
  const el = React.createElement(type, props, children);
  const intlProvider = React.createElement(IntlProvider, {locale, messages: messages[locale] || {}}, el);
  const reduxProvider = React.createElement(Provider, {store}, intlProvider);
  return reduxProvider;
}

export function createTestStore(state) {
  commonInit();
  return createStore(reduxReactRouter, createMemoryHistory, state || {});
}

/**
 * Constructor for a mock response object; the `writer`
 * property is just about enough to pass to our Express renderers.
 * @param done {Function} Called when the request is finished (when `send` is called).
 * @constructor
 */
function MockResponse(done = noop) {
  var res = this;
  var _status = null;
  var _body = "";
  const writer = this.writer = {
    status: (code) => {
      _status = code;
      return writer;
    },
    json: (json) => {
      return writer.send(JSON.stringify(json));
    },
    send: (data) => {
      _body += data;
      done(res);
    }
  };
  res.dump = () => {
    return {status: _status, body: _body};
  };
}

/**
 * Get a promise for rendering a given request's response.
 * Server rendering is forced true for these requests.
 *
 * @param request Express-like request object. Just setting `url` should be enough.
 * @param settings Settings object.
 * @param initialState Initial state.
 * @return {Promise}
 */
export function getRenderPromise(request, initialState = {}, settings = {}) {
  const render = require('../server/render');
  settings = assign({}, settings, {serverRendering: true, dev: true});
  request.__proto__ = express.request;
  if (!request.method) {
    request.method = "GET";
  }
  return new Promise((resolve, reject) => {
    const mockResponse = new MockResponse((res) => {
      resolve(res.dump());
    });
    render(request, mockResponse.writer, settings, initialState);
  });
}

/**
 * Set up or tear down the JSDOM DOM set up in global variables.
 * @param mode
 */
export function dom(mode) {
  if (mode) {
    global.document = jsdom('<!doctype html><html><body></body></html>');
    global.window = document.defaultView;
    global.navigator = global.window.navigator;
  } else {
    global.document = undefined;
    global.window = undefined;
    global.navigator = undefined;
  }
}

/**
 * Sugar for setting up a Mocha suite with a DOM for each test.
 * @param name
 * @param fn
 */
export function domDescribe(name, fn) {
  describe(name, () => {
    beforeEach(() => dom(true));
    fn();
    afterEach(() => dom(false));
  })
}

/**
 * Meta-function for easily testing both logged-in and logged-out states.
 *
 * The given `fn` is called with an object with {state, message} keys;
 * `state` is an initial state object and `message` something to append to
 * the test description.
 *
 * @param state State to merge in.
 * @param fn Test-declaring (`it...`) function.
 */
export function withAndWithoutUser(state = null, fn = null) {
  if (typeof state === 'function') {
    fn = state;
    state = {};
  }
  [
    {state: assign({}, state, {user: null}), message: "when not logged in"},
    {state: assign({}, state, {user: mockUser}), message: "when logged in"}
  ].forEach(fn);
}

function streamify(s) {
  if (typeof s === "string") {
    var rs = new Readable;
    rs.push("" + s);
    rs.push(null);
    return rs;
  }
  return s;
}

/**
 * Return a mock fetch() replacement function for the given URL map.
 *
 * The URL map handlers are functions (or just straight data).
 * Functions have the signature (url, options) (exactly those given to fetch()).
 * The data, or the functions' retvals, should be Response objects (see
 * `jsonResponse`), strings (assumed typeless OK responses), or objects with {body, init},
 * that are then used to instantiate Responses.
 *
 * In addition, the returned function will have a `.calls` dictionary, recording the times
 * each endpoint was called.
 *
 * @param urlMap URL map dictionary.
 * @return {fetcher} A fetcher function.
 */
export function mockFetch(urlMap) {
  const calls = {};
  const fetcher = (url, options) => {
    calls[url] = (calls[url] || 0) + 1;
    const handler = urlMap[url];
    if (!handler) {
      throw new Error("Unexpected fetch for URL " + url + " (options " + options + ")");
    }
    let rv = null;
    if (typeof handler === 'function') {
      rv = handler(url, options);
    } else {
      rv = handler; // Assumed straight data.
    }
    if (rv.then) { // Smells like a promise -- fine!
      return rv;
    }
    if (typeof rv === "string") {
      rv = {body: rv, init: {status: 200}};
    }
    if (rv.body && rv.init) {
      rv = new Response(streamify(rv.body), rv.init);
    }
    if (!(rv.json && typeof rv.json === 'function')) {
      throw new Error("The return value from mockFetch handler for " + url + " did not return a response");
    }
    return new Promise((resolve) => {
      resolve(rv);
    });
  };
  fetcher.calls = calls;
  return fetcher;
}

export function jsonResponse(content, status = 200) {
  return new Response(
    streamify(JSON.stringify(content)),
    {
      status,
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
