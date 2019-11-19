import {handleActions} from 'redux-actions';

const INITIAL_STATE = {
  isFetching: false,
  data: null
};

const fetchUserData = (state) => ({
  ...state,
  isFetching: true
});

const receiveUserData = (state, {payload}) => {
  if (payload) {
    return {isFetching: false, data: payload};
  }
  return INITIAL_STATE;
};
const clearUserData = (/* state, action */) => INITIAL_STATE;

export default handleActions({fetchUserData, receiveUserData, clearUserData}, INITIAL_STATE);
