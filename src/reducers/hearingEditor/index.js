import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';
import {EditorActions} from '../../actions/hearingEditor';
import hearing from './hearing';
import labels from './labels';
import contactPersons from './contactPersons';
import sections from './sections';
import projects from './projects';

const showEditor = handleActions({
  [EditorActions.BEGIN_EDIT_HEARING]: () => true,
  [EditorActions.INIT_NEW_HEARING]: () => true,
  [EditorActions.SHOW_FORM]: () => true,
  [EditorActions.CLOSE_FORM]: () => false,
}, false);

const editorPending = handleActions({
  beginFetchHearing: (state) => state + 1,
  receiveHearing: (state) => state - 1,
  receiveHearingError: (state) => state - 1,
  [EditorActions.FETCH_META_DATA]: (state) => state + 1,
  [EditorActions.RECEIVE_META_DATA]: (state) => state - 1,
}, 0);

const editorIsSaving = handleActions({
  [EditorActions.POST_HEARING]: () => true,
  [EditorActions.SAVE_HEARING]: () => true,
  [EditorActions.POST_HEARING_SUCCESS]: () => false,
  [EditorActions.SAVE_HEARING_SUCCESS]: () => false,
  [EditorActions.SAVE_HEARING_FAILED]: () => false,
}, false);

const editorState = combineReducers({
  show: showEditor,
  pending: editorPending,
  isSaving: editorIsSaving
});

const errors = handleActions({
  [EditorActions.SAVE_HEARING_FAILED]: (state, {payload}) =>
    payload.errors,
  [EditorActions.POST_HEARING_SUCCESS]: () => null
}, null);

const languages = handleActions({
  receiveHearing: (state, {payload: {data: {title}}}) =>
    Object.keys(title).reduce((langArr, lang) => (title[lang] ? [...langArr, lang] : langArr), []),
  [EditorActions.SET_LANGUAGES]: (state, {payload}) => payload.languages,
  [EditorActions.INIT_NEW_HEARING]: () => ['fi']
}, []);

export default combineReducers({
  contactPersons,
  editorState,
  errors,
  hearing,
  labels,
  languages,
  sections,
  projects
});
