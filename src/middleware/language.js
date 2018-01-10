import {setLanguage} from '../actions';
import {stringifyQuery, parseQuery} from '../utils/urlQuery';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';
import {push} from 'react-router-redux';
import config from '../config';

export const languageFromUrlMiddleware = store => next => action => {
  if (action.type !== '@@router/LOCATION_CHANGE') {
    return next(action);
  }
  if (isEmpty(parseQuery(action.payload.search).lang) || isEmpty(find(config.languages, (lang) => lang === parseQuery(action.payload.search).lang))) {
    store.dispatch(push({location: action.payload.pathname, search: stringifyQuery({lang: store.getState().language})}));
    return next(action);
  }
  if (parseQuery(action.payload.search).lang !== store.getState().language) {
    store.dispatch(setLanguage(parseQuery(action.payload.search).lang));
    return next(action);
  }
  return next(action);
};

export default languageFromUrlMiddleware;
