import { handleActions } from 'redux-actions';
import updeep from 'updeep';

const INITIAL_STATE = {
  isFetching: false,
  user: null,
};

const fetchOidcUserData = (state) => ({
    ...state,
    isFetching: true
  });
  
  const receiveOidcUserData = (state, { payload }) => {
    if (payload) {
      return updeep({
        isFetching: false,
        user: payload.oidcUser,
      }, state);
    }
    return INITIAL_STATE;
  };
  const clearOidcUserData = (/* state, action */) => INITIAL_STATE;

  export default handleActions({
    fetchOidcUserData,
    receiveOidcUserData,
    clearOidcUserData,
  }, INITIAL_STATE);

