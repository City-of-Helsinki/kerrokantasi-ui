// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import {EditorActions} from '../../actions/hearingEditor';

const byId = handleActions({
  [EditorActions.RECEIVE_META_DATA]: (state, {payload: {labels}}) => labels.entities.labels
}, {});

const all = handleActions({
  [EditorActions.RECEIVE_META_DATA]: (state, {payload: {labels}}) => labels.result
}, []);

const isFetching = handleActions({
  [EditorActions.FETCH_META_DATA]: () => true,
  [EditorActions.RECEIVE_META_DATA]: () => false,
}, false);

export default combineReducers({
  byId,
  all,
  isFetching,
});
