import {handleActions} from 'redux-actions';
import config from "../config";

const INITIAL_STATE = {
  loadingToken: false,
  apiToken: null,
  apiInitialized: true,
};

const fetchApiToken = (state) => ({
  ...state,
  isFetching: true
});

const receiveApiToken = (state, {payload}) => {
  if (payload) {
    return {isFetching: false, apiToken: payload[config.openIdAudience]};
  }
  return INITIAL_STATE;
};

const clearApiToken = () => {
  return INITIAL_STATE;
};

export default handleActions({fetchApiToken, receiveApiToken, clearApiToken}, INITIAL_STATE);
