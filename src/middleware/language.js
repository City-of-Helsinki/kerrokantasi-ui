import {setLanguage} from '../actions';
import {stringifyQuery, parseQuery} from '../utils/urlQuery';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';
import merge from 'lodash/merge';
import {push} from 'react-router-redux';
import config from '../config';

export const languageFromUrlMiddleware = store => next => action => {
  if (action.type !== '@@router/LOCATION_CHANGE') {
    return next(action);
  }
  // This will allow browser back button to work, maybe not optimal but seems to do the job...
  if (store.getState().router.location && action.payload.pathname === store.getState().router.location.pathname && isEmpty(parseQuery(action.payload.search).lang)) {
    window.history.go(-2);
    return next(action);
  }
  // This will add the language query to url if missing or replace invalid language with the current one
  if (isEmpty(parseQuery(action.payload.search).lang) || isEmpty(find(config.languages, (lang) => lang === parseQuery(action.payload.search).lang))) {
    store.dispatch(push({location: action.payload.pathname, search: stringifyQuery(merge(parseQuery(action.payload.search), {lang: store.getState().language}))}));
    return next(action);
  }
  // This will change the current language to store if new is legit and different than current one
  if (parseQuery(action.payload.search).lang !== store.getState().language) {
    store.dispatch(setLanguage(parseQuery(action.payload.search).lang));
    return next(action);
  }
  return next(action);
};

export default languageFromUrlMiddleware;
