import updeep from 'updeep';
import {handleActions} from 'redux-actions';

const beginFetchHearing = (state, {payload}) => {
  if (state[payload.hearingSlug]) {
    // If we already have this hearing, we're only probably refreshing it,
    // so preserve the current state if we can...
    return state;
  }
  return updeep({
    [payload.hearingSlug]: {state: "pending"}
  }, state);
};

const receiveHearing = (state, {payload}) => {
  return updeep({
    [payload.hearingSlug]: {state: "done", data: payload.data}
  }, state);
};

export default handleActions({
  beginFetchHearing,
  receiveHearing
}, {});
