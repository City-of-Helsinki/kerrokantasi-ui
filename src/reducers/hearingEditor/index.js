import { combineReducers, createReducer } from '@reduxjs/toolkit';

import { EditorActions } from '../../actions/hearingEditor';
import hearing from './hearing';
import labels from './labels';
import contactPersons from './contactPersons';
import organizations from './organizations';
import sections from './sections';

const showEditor = createReducer(false, (builder) => {
  builder
    .addCase(EditorActions.INIT_NEW_HEARING, () => true)
    .addCase(EditorActions.SHOW_FORM, () => true)
    .addCase(EditorActions.CLOSE_FORM, () => false);
});

const editorPending = createReducer(0, (builder) => {
  builder
    .addCase('beginFetchHearing', (state) => state + 1)
    .addCase('receiveHearing', (state) => state - 1)
    .addCase('receiveHearingError', (state) => state - 1)
    .addCase(EditorActions.FETCH_META_DATA, (state) => state + 1)
    .addCase(EditorActions.RECEIVE_META_DATA, (state) => state - 1)
    .addCase(EditorActions.FETCH_CONTACT_PERSONS, (state) => state - 1)
    .addCase(EditorActions.RECEIVE_CONTACT_PERSONS, (state) => state + 1);
});

const editorIsSaving = createReducer(false, (builder) => {
  builder
    .addCase(EditorActions.POST_HEARING, () => true)
    .addCase(EditorActions.SAVE_HEARING, () => true)
    .addCase(EditorActions.POST_HEARING_SUCCESS, () => false)
    .addCase(EditorActions.SAVE_HEARING_SUCCESS, () => false)
    .addCase(EditorActions.SAVE_HEARING_FAILED, () => false);
});

const editorState = combineReducers({
  show: showEditor,
  pending: editorPending,
  isSaving: editorIsSaving,
});

const errors = createReducer(null, (builder) => {
  builder
    .addCase(
      EditorActions.SAVE_HEARING_FAILED,
      (_state, { payload }) => payload.errors
    )
    .addCase(EditorActions.POST_HEARING_SUCCESS, () => null);
});

const languages = createReducer([], (builder) => {
  builder
    .addCase(
      'receiveHearing',
      (
        state,
        {
          payload: {
            data: { title },
          },
        }
      ) =>
        Object.keys(title).reduce(
          (langArr, lang) => (title[lang] ? [...langArr, lang] : langArr),
          []
        )
    )
    .addCase(
      EditorActions.SET_LANGUAGES,
      (_state, { payload }) => payload.languages
    )
    .addCase(EditorActions.INIT_NEW_HEARING, () => ['fi']);
});

export default combineReducers({
  contactPersons,
  organizations,
  editorState,
  errors,
  hearing,
  labels,
  languages,
  sections,
});
