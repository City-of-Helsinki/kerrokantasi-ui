import createHistory from 'history/lib/createBrowserHistory';
import rootReducer from 'reducers';
import routes from 'routes';
import {compose, createStore} from 'redux';
import {reduxReactRouter} from 'redux-router';
const initialState = (typeof window !== undefined ? window.STATE : {});
const augmentedCreateStore = compose(
  reduxReactRouter({routes, createHistory})
)(createStore);
const store = augmentedCreateStore(rootReducer, initialState);
export default store;
