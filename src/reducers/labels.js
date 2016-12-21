import updeep from 'updeep';
import {handleActions} from 'redux-actions';

const beginFetchLabels = (state) => (
  updeep({
    isFetching: true
  }, state));

const receiveLabels = (state, {payload}) => (
  updeep({
    isFetching: false, data: payload.data
  }, state));

export default handleActions({
  beginFetchLabels,
  receiveLabels
}, {isFetching: false, data: []});
