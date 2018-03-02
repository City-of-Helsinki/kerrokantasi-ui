import {parseQuery} from '../utils/urlQuery';

export default function headless(state, action) {
  if (action.type === 'checkHeadless') {
    return action.payload;
  }
  // first check for initial state
  return state || parseQuery(window.location.search).headless === 'true';
}
