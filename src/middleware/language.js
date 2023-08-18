import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';

import {setLanguage} from '../actions';
import {parseQuery} from '../utils/urlQuery';
import config from '../config';

export const languageFromUrlMiddleware = store => next => action => {
  if (action.type !== '@@router/LOCATION_CHANGE') {
    return next(action);
  }
  if (isEmpty(parseQuery(action.payload.search).lang)) {
    store.dispatch(setLanguage('fi'));
    return next(action);
  }
  // This will change the current language to store if new is legit and different than current one
  if (
    parseQuery(action.payload.search).lang !== store.getState().language
    && !isEmpty(find(config.languages, (lang) => lang === parseQuery(action.payload.search).lang))) {
    store.dispatch(setLanguage(parseQuery(action.payload.search).lang));
    return next(action);
  }
  return next(action);
};

export default languageFromUrlMiddleware;
