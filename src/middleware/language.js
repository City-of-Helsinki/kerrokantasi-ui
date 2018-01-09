import {setLanguage} from '../actions';
import {parseQuery} from '../utils/urlQuery';

export const languageFromUrlMiddleware = store => next => action => {
  if (action.type !== '@@router/LOCATION_CHANGE') return next(action);

  store.dispatch(setLanguage(parseQuery(action.payload.search).lang));
  return next(action);
};

export default languageFromUrlMiddleware;
