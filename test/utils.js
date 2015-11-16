import assign from 'lodash/object/assign';
import commonInit from 'commonInit';
import createMemoryHistory from 'history/lib/createMemoryHistory';
import createStore from 'createStore';
import messages from 'i18n';
import React from 'react';
import {createRenderer} from 'react-addons-test-utils';
import {IntlProvider} from 'react-intl';
import {Provider} from 'react-redux';
import {reduxReactRouter} from 'redux-router';

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
