import {checkHeadless} from '../actions';
import {checkHeadlessParam} from '../utils/urlQuery';

export const headlessFromUrlMiddleware = store => next => action => {
  if (action.type === '@@router/LOCATION_CHANGE') {
    store.dispatch(checkHeadless(checkHeadlessParam(window.location.search)));
  }
  return next(action);
};

export default headlessFromUrlMiddleware;
