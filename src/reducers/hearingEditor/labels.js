import { combineReducers, createReducer } from '@reduxjs/toolkit';
import { get } from 'lodash';

import { EditorActions } from '../../actions/hearingEditor';

const byId = createReducer({}, (builder) => {
  builder
    .addCase(
      EditorActions.RECEIVE_META_DATA,
      (_state, { payload: { labels } }) =>
        labels.entities.labels ? labels.entities.labels : {}
    )
    .addCase(
      EditorActions.UPDATE_HEARING_AFTER_SAVE,
      (state, { payload: { entities } }) => ({
        ...state,
        ...entities.labels,
      })
    )
    .addCase(
      EditorActions.ADD_LABEL_SUCCESS,
      (state, { payload: { label } }) => ({
        ...state,
        [label.id]: { ...label, frontId: label.id },
      })
    );
});

const all = createReducer([], (builder) => {
  builder
    .addCase(
      EditorActions.RECEIVE_META_DATA,
      (_state, { payload: { labels } }) =>
        labels.result.map((key) => key.toString())
    )
    .addCase(
      EditorActions.UPDATE_HEARING_AFTER_SAVE,
      (state, { payload: { entities } }) => [
        ...new Set([...state, ...Object.keys(get(entities, 'labels', {}))]),
      ]
    )
    .addCase(
      EditorActions.ADD_LABEL_SUCCESS,
      (state, { payload: { label } }) => [...state, label.id.toString()]
    );
});

const labels = createReducer({}, (builder) => {
  builder
    .addCase(EditorActions.ADD_LABEL, () => true)
    .addCase(
      EditorActions.ADD_LABEL_FAILED,
      (_state, { payload }) => payload.errors
    )
    .addCase(EditorActions.ADD_LABEL_SUCCESS, () => null);
});

export default combineReducers({
  byId,
  all,
  labels,
});
