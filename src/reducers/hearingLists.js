import { createReducer } from '@reduxjs/toolkit';

const hearingListSkeleton = {
  isFetching: false,
  data: [],
};

const hearingListsWithMapView = [
  'allHearings',
  'openHearings',
  'publishedHearings',
  'publishingQueueHearings',
  'draftHearings',
  'ownHearings',
];

const userHearingLists = [
  'userHearingsOpen',
  'userHearingsQueue',
  'userHearingsClosed',
  'userHearingsDrafts',
];

const initialHearingListNames = [
  ...hearingListsWithMapView.flatMap((listName) => [
    listName,
    `${listName}Map`,
  ]),
  ...userHearingLists,
];

const createHearingLists = (listNames) =>
  listNames.reduce(
    (listState, name) => ({ ...listState, [name]: hearingListSkeleton }),
    {}
  );

const beginFetchHearingList = (state, { payload }) => ({
  ...state,
  [payload.listId]: { ...state[payload.listId], isFetching: true },
});

const receiveMoreHearings = (state, { payload: { listId, data } }) => {
  const combinedResults =
    state[listId].data.length > 0
      ? [...state[listId].data, ...data.results]
      : data.results;

  return {
    ...state,
    [listId]: {
      isFetching: false,
      data: combinedResults,
      count: data.count,
      next: data.next,
    },
  };
};

const receiveHearingList = (state, { payload: { listId, data } }) => ({
  ...state,
  [listId]: {
    isFetching: false,
    data: data.results,
    count: data.count,
    next: data.next,
  },
});

export default createReducer(
  createHearingLists(initialHearingListNames),
  (builder) => {
    builder
      .addCase('beginFetchHearingList', beginFetchHearingList)
      .addCase('receiveHearingList', receiveHearingList)
      .addCase('receiveMoreHearings', receiveMoreHearings);
  }
);
