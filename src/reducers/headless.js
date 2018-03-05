import {checkHeadlessParam} from '../utils/urlQuery';

export default function headless(state, action) {
  if (action.type === 'setHeadless') {
    return action.payload;
  }
  // first check for initial state
  return state || checkHeadlessParam(window.location.search);
}
