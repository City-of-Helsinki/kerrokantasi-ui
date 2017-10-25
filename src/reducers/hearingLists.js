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

const receiveMoreHearings = (state, { payload: { listId, data } }) => {
  const combinedResults = state[listId].data.length > 0 ? [...state[listId].data, ...data.results] : data.results;

  return updeep({
    [listId]: {isFetching: false, data: combinedResults, count: data.count, next: data.next}
  }, state);
};

const receiveHearingList = (state, {payload: {listId, data}}) => {
  return updeep({
    [listId]: {isFetching: false, data: data.results, count: data.count, next: data.next}
  }, state);
};

export default handleActions({
  beginFetchHearingList,
  receiveHearingList,
  receiveMoreHearings
}, createHearingLists([
  'allHearings',
  'openHearings',
  'publishedHearings',
  'publishingQueueHearings',
  'draftHearings'
]));
