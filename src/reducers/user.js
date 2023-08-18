import {handleActions} from 'redux-actions';
import updeep from 'updeep';

const INITIAL_STATE = {
  isFetching: false,
  data: null,
  profile: {},
};

const fetchUserData = (state) => ({
  ...state,
  isFetching: true
});

const receiveUserData = (state, {payload}) => {
  if (payload) {
    return updeep({
      isFetching: false,
      data: payload,
    }, state);
  }
  return INITIAL_STATE;
};
const clearUserData = (/* state, action */) => INITIAL_STATE;


const receiveUserComments = (state, {payload}) => updeep({
    profile: {comments: {
      count: payload.data.count,
      results: payload.data.results,
    }}
  }, state);


const modifyFavoriteHearingsData = (state, {payload}) => {
  const currentFollowed = state.data.favorite_hearings;
  let updatedFollowed;
  if (currentFollowed.includes(payload.hearingId)) {
    updatedFollowed = currentFollowed.filter(id => id !== payload.hearingId);
  } else {
    updatedFollowed = [...currentFollowed, payload.hearingId];
  }

  return updeep({
    data: {favorite_hearings: updatedFollowed},
  }, state);
};


const receiveFavoriteHearings = (state, {payload}) => updeep({
    profile: {favoriteHearings: payload.data}
  }, state);
export default handleActions({
  fetchUserData,
  receiveUserData,
  clearUserData,
  receiveUserComments,
  modifyFavoriteHearingsData,
  receiveFavoriteHearings}, INITIAL_STATE);
