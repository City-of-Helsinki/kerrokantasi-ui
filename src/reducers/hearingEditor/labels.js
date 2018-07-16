// @flow
import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { get } from 'lodash';

import { EditorActions } from '../../actions/hearingEditor';

const byId = handleActions(
  {
    [EditorActions.RECEIVE_META_DATA]: (state, { payload: { labels } }) => {
      return labels.entities.labels ? labels.entities.labels : [];
    },
    [EditorActions.UPDATE_HEARING_AFTER_SAVE]: (state, { payload: { entities } }) => ({
      ...state,
      ...entities.labels,
    }),
    [EditorActions.ADD_LABEL_SUCCESS]: (state, { payload: { label } }) => ({...state, [label.id]: {...label, frontId: label.id}})
  },
  {},
);

const all = handleActions(
  {
    [EditorActions.RECEIVE_META_DATA]: (state, { payload: { labels } }) => labels.result.map(key => key.toString()),
    [EditorActions.UPDATE_HEARING_AFTER_SAVE]: (state, { payload: { entities } }) => [
      ...new Set([...state, ...Object.keys(get(entities, 'labels', {}))]),
    ],
    [EditorActions.ADD_LABEL_SUCCESS]: (state, { payload: { label } }) => [...state, label.id.toString()]
  },
  [],
);

// const isFetching = handleActions(
//   {
//     [EditorActions.FETCH_META_DATA]: () => true,
//     [EditorActions.RECEIVE_META_DATA]: () => false,
//     [EditorActions.ERROR_META_DATA]: () => false,
//   },
//   false,
// );

const labels = handleActions({
  [EditorActions.ADD_LABEL]: () => true,
  [EditorActions.ADD_LABEL_FAILED]: (state, {payload}) => payload.errors,
  [EditorActions.ADD_LABEL_SUCCESS]: () => null
}, {});

export default combineReducers({
  byId,
  all,
  // isFetching,
  labels
});
