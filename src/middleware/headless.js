import { setHeadless } from '../actions';
import { checkHeadlessParam } from '../utils/urlQuery';

export const headlessFromUrlMiddleware = store => next => action => {
  if (action.type === '@@router/LOCATION_CHANGE') {
    store.dispatch(setHeadless(checkHeadlessParam(window.location.search)));
  }
  return next(action);
};

export default headlessFromUrlMiddleware;
