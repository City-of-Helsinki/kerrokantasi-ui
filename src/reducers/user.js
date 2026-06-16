import { createReducer } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  isFetching: false,
  data: null,
  profile: {},
  favoriteHearingsFetching: false,
};

const fetchUserData = (state) => ({ ...state, isFetching: true });

const receiveUserData = (_state, { payload }) => {
  if (payload) {
    return { ...INITIAL_STATE, isFetching: false, data: payload };
  }
  return INITIAL_STATE;
};
const clearUserData = (/* state, action */) => INITIAL_STATE;

const receiveUserComments = (state, { payload }) => ({
  ...state,
  profile: {
    ...state.profile,
    comments: {
      count: payload.data.count,
      results: payload.data.results,
    },
  },
});

const modifyFavoriteHearingsData = (state, { payload }) => {
  const currentFollowed = state.data.favorite_hearings;
  const updatedFollowed = currentFollowed.includes(payload.hearingId)
    ? currentFollowed.filter((id) => id !== payload.hearingId)
    : [...currentFollowed, payload.hearingId];

  return {
    ...state,
    data: { ...state.data, favorite_hearings: updatedFollowed },
  };
};

const receiveFavoriteHearings = (state, { payload }) => ({
  ...state,
  profile: { ...state.profile, favoriteHearings: payload.data },
  favoriteHearingsFetching: false,
});

const beginFetchFavoriteHearings = (state) => ({
  ...state,
  favoriteHearingsFetching: true,
});

const receiveFavoriteHearingsError = (state) => ({
  ...state,
  favoriteHearingsFetching: false,
});

export default createReducer(INITIAL_STATE, (builder) => {
  builder
    .addCase('fetchUserData', fetchUserData)
    .addCase('receiveUserData', receiveUserData)
    .addCase('clearUserData', clearUserData)
    .addCase('receiveUserComments', receiveUserComments)
    .addCase('modifyFavoriteHearingsData', modifyFavoriteHearingsData)
    .addCase('beginFetchFavoriteHearings', beginFetchFavoriteHearings)
    .addCase('receiveFavoriteHearings', receiveFavoriteHearings)
    .addCase('receiveFavoriteHearingsError', receiveFavoriteHearingsError);
});
