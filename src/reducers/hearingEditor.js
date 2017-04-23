import {handleActions} from 'redux-actions';
import {combineReducers} from 'redux';
import {cloneDeep, findIndex} from 'lodash';

import {initNewHearing, getOrCreateSectionByID} from '../utils/hearing';
import {EditorActions} from '../actions/hearingEditor';

// TODO: Flatten the state => normalize sections & contact_persons
const hearing = handleActions({
  [EditorActions.BEGIN_EDIT_HEARING]: (state, {payload}) => (
    {hearing: payload}
  ),
  [EditorActions.BEGIN_CREATE_HEARING]: () => (initNewHearing()),
  [EditorActions.EDIT_HEARING]: (state, {payload: {field, value}}) => {
    return Object.assign({}, state, {[field]: value});
  },
  [EditorActions.EDIT_SECTION]:
    (state, {payload: {sectionID, field, value}}) => {
      const newState = cloneDeep(state);
      const section = getOrCreateSectionByID(newState, sectionID);
      section[field] = value;
      return Object.assign({}, newState);
    },
  [EditorActions.ADD_SECTION]: (state, {payload: {section}}) => {
    const newState = cloneDeep(state);
    newState.sections.push(section);
    return Object.assign({}, newState);
  },
  [EditorActions.REMOVE_SECTION]: (state, {payload: {sectionID}}) => {
    const newState = cloneDeep(state);
    const index = findIndex(newState.sections, (section) => {
      if (section.id) {
        return section.id === sectionID;
      }
      return section.frontID === sectionID;
    });
    if (index >= 0) {
      newState.sections.splice(index, 1);
    }
    return Object.assign({}, newState);
  }
}, {});

const languages = handleActions({
  [EditorActions.BEGIN_EDIT_HEARING]: (state, {payload: {hearing: {title}}}) =>
    Object.keys(title).reduce((langArr, lang) => (title[lang] ? [...langArr, lang] : langArr), []),
  [EditorActions.SET_LANGUAGES]: (state, {payload}) => payload.languages,
  [EditorActions.BEGIN_CREATE_HEARING]: () => ['fi']
}, []);

const metaData = handleActions({
  [EditorActions.RECEIVE_META_DATA]: (state, {payload}) => (
    {...payload}
  )
}, {});

const EditorStates = {
  EDIT: 'editForm',
  PREVIEW: 'preview',
  PENDING: 'pending'
};

const editorState = handleActions({
  [EditorActions.BEGIN_CREATE_HEARING]: () => EditorStates.PENDING,
  [EditorActions.BEGIN_EDIT_HEARING]: () => EditorStates.PENDING,
  [EditorActions.RECEIVE_META_DATA]: (state) => (state === EditorStates.PENDING ? EditorStates.EDIT : state),
  [EditorActions.SHOW_EDITOR]: () => EditorStates.EDIT,
  [EditorActions.CLOSE_EDITOR]: () => EditorStates.PREVEW,
  [EditorActions.POST_HEARING_SUCCESS]: () => EditorStates.PREVEW
}, null);

const errors = handleActions({
  [EditorActions.POST_HEARING_ERROR]: (state, {payload}) =>
    payload.errors,
  [EditorActions.POST_HEARING_SUCCESS]: () => []
}, null);

const isPosting = handleActions({
  [EditorActions.POST_HEARING]: () => true,
  [EditorActions.POST_HEARING_SUCCESS]: () => false,
  [EditorActions.POST_HEARING_ERROR]: () => false
}, false);

const sections = handleActions({
}, {});

const reducer = combineReducers({
  hearing,
  sections,
  languages,
  metaData,
  editorState,
  errors,
  isPosting
});

export default reducer;
