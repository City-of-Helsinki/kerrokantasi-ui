import createHistory from 'history/lib/createBrowserHistory';
import rootReducer from 'reducers';
import routes from 'routes';
import {compose, createStore, applyMiddleware} from 'redux';
import {reduxReactRouter} from 'redux-router';
import thunk from 'redux-thunk';
const initialState = (typeof window !== undefined ? window.STATE : {});
const middleware = [thunk];

if (process.env.NODE_ENV !== "production") {
  middleware.push(require('redux-logger')());
}

const augmentedCreateStore = compose(
  applyMiddleware(...middleware),
  reduxReactRouter({routes, createHistory})
)(createStore);
const store = augmentedCreateStore(rootReducer, initialState);
export default store;
