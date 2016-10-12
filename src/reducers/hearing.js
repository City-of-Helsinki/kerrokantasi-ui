import updeep from 'updeep';
import {handleActions} from 'redux-actions';
import {has, isEmpty} from 'lodash';


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


const savedHearingChange = (state, {payload}) => {
  const hearing = payload.hearing;
  if (has(state, hearing.slug) || isEmpty(state)) {
    // We have just saved hearing with the same slug as we have in
    // state. In order to keep the hearing up to date, let's update it
    // accordingly.
    return updeep({
      [hearing.slug]: {state: "done", data: hearing}
    }, state);
  }
  return state;
};


export default handleActions({
  beginFetchHearing,
  receiveHearing,
  savedHearingChange,
  savedNewHearing: savedHearingChange,
}, {});
