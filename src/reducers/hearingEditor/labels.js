// @flow
import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import {EditorActions} from '../../actions/hearingEditor';

const byId = handleActions({
  [EditorActions.RECEIVE_META_DATA]: (state, {payload: {labels}}) => labels.entities.labels,
  [EditorActions.UPDATE_HEARING_AFTER_SAVE]: (state, {payload: {entities}}) => ({
    ...state,
    ...entities.labels,
  })
}, {});

const all = handleActions({
  [EditorActions.RECEIVE_META_DATA]: (state, {payload: {labels}}) => labels.result,
  [EditorActions.UPDATE_HEARING_AFTER_SAVE]: (state, {payload: {entities}}) =>
    [...new Set([
      ...state,
      ...entities.labels.map((label) => label.frontId)
    ])],
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
