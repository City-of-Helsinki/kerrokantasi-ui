const updeep = require('updeep');
import {handleActions} from 'redux-actions';

const beginFetchHearingList = (state, {payload}) => (updeep({
  [payload.listId]: {"state": "pending"}
}, state));

const receiveHearingList = (state, {payload}) => {
  return updeep({
    [payload.listId]: {"state": "done", "data": payload.data}
  }, state);
};

export default handleActions({
  beginFetchHearingList,
  receiveHearingList
}, {});
