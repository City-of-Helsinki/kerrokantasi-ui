import updeep from 'updeep';
import {handleActions} from 'redux-actions';

const beginFetchHearingList = (state, {payload}) => (updeep({
  [payload.listId]: {isFetching: true}
}, state));

const receiveHearingList = (state, {payload}) => {
  return updeep({
    [payload.listId]: {isFetching: false, data: payload.data}
  }, state);
};

export default handleActions({
  beginFetchHearingList,
  receiveHearingList
}, { allHearings: { isFetching: false, data: [] }});
