const updeep = require('updeep');
import {handleActions} from 'redux-actions';

const beginFetchHearing = (state, {payload}) => (updeep({
  [payload.hearingId]: {"state": "pending"}
}, state));

const receiveHearing = (state, {payload}) => {
  return updeep({
    [payload.hearingId]: {"state": "done", "data": payload.data}
  }, state);
};

export default handleActions({
  beginFetchHearing,
  receiveHearing
}, {});
