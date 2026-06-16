import { createReducer } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  isFetching: false,
  user: null,
};

const fetchOidcUserData = (state) => ({ ...state, isFetching: true });

const receiveOidcUserData = (_state, { payload }) => {
  if (payload) {
    return { isFetching: false, user: payload.oidcUser };
  }
  return INITIAL_STATE;
};
const clearOidcUserData = (/* state, action */) => INITIAL_STATE;

export default createReducer(INITIAL_STATE, (builder) => {
  builder
    .addCase('fetchOidcUserData', fetchOidcUserData)
    .addCase('receiveOidcUserData', receiveOidcUserData)
    .addCase('clearOidcUserData', clearOidcUserData);
});
