import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';

import { setLanguage } from '../actions';
import { parseQuery } from '../utils/urlQuery';
import config from '../config';

export const languageFromUrlMiddleware = store => next => action => {
  if (action.type !== '@@router/LOCATION_CHANGE') {
    return next(action);
  }
  
  const queryLang = action.payload.location ? parseQuery(action.payload.location.search).lang : '';
  
  if (isEmpty(queryLang)) {
    store.dispatch(setLanguage('fi'));
    return next(action);
  }
  // This will change the current language to store if new is legit and different than current one
  if (
    queryLang !== store.getState().language
    && !isEmpty(find(config.languages, (lang) => lang === queryLang))) {
    store.dispatch(setLanguage(queryLang));
    return next(action);
  }
  return next(action);
};

export default languageFromUrlMiddleware;
