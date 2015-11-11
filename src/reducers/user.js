import {handleActions} from 'redux-actions';

const receiveUserData = (state, {payload}) => {
  if (payload && payload.id) {
    return payload;
  }
  return null;
};
const clearUserData = (/* state, action */) => null;

export default handleActions({receiveUserData, clearUserData}, null);
