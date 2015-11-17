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
