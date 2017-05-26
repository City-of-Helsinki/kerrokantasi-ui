import updeep from 'updeep';
import {handleActions} from 'redux-actions';

const hearingListSkeleton = {
  isFetching: false, data: []
};

const createHearingLists = (listNames) =>
  listNames.reduce((listState, name) => Object.assign({}, listState, {[name]: hearingListSkeleton}), {});

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
}, createHearingLists([
  'allHearings',
  'openHearings',
  'publishedHearings',
  'publishingQueueHearings',
  'draftHearings'
]));
