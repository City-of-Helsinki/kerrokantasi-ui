import {compose, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';
import routes from './routes';
import hearingEditorMiddlware from './middleware/hearingEditor';

import identity from 'lodash/identity';

const middleware = [thunk, ...hearingEditorMiddlware];

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  middleware.push(require('redux-logger')());
}

export default function createAppStore(router, createHistory, initialState = null) {
  // Have to pass in the router to support isomorphic rendering
  const augmentedCreateStore = compose(
    applyMiddleware(...middleware),
    router({routes, createHistory}),
    (typeof window !== 'undefined' && window.devToolsExtension ? window.devToolsExtension() : identity)
  )(createStore);
  return augmentedCreateStore(rootReducer, initialState || {});
}
