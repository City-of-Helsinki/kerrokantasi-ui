import {checkHeadless} from '../actions';
import {parseQuery} from '../utils/urlQuery';

export const headlessFromUrlMiddleware = store => next => action => {
  if (action.type === 'checkHeadless') {
    store.dispatch(checkHeadless(parseQuery(window.location.search).headless === 'true'));
  }
  return next(action);
};

export default headlessFromUrlMiddleware;
