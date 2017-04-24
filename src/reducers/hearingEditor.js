import {handleActions} from 'redux-actions';
import {combineReducers} from 'redux';
import {cloneDeep, findIndex} from 'lodash';

import {initNewHearing, getOrCreateSectionByID} from '../utils/hearing';
import {EditorActions} from '../actions/hearingEditor';

// TODO: Flatten the state => normalize sections & contact_persons
const hearingReducer = handleActions({
  receiveHearing: (state, {payload: {data}}) => (
    data
  ),
  [EditorActions.BEGIN_EDIT_HEARING]: (state, {payload}) => (
    payload.hearing
  ),
  [EditorActions.INIT_NEW_HEARING]: () => (initNewHearing()),
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

const hearingIsFetching = handleActions({
  beginFetchHearing: () => true,
  receiveHearing: () => false
}, false);

const hearing = combineReducers({
  hearing: hearingReducer,
  isFetching: hearingIsFetching
});

const languages = handleActions({
  receiveHearing: (state, {payload: {data: {title}}}) =>
    Object.keys(title).reduce((langArr, lang) => (title[lang] ? [...langArr, lang] : langArr), []),
  [EditorActions.SET_LANGUAGES]: (state, {payload}) => payload.languages,
  [EditorActions.INIT_NEW_HEARING]: () => ['fi']
}, []);

const metaData = handleActions({
  [EditorActions.FETCH_META_DATA]: () => ({isFetching: true}),
  [EditorActions.RECEIVE_META_DATA]: (state, {payload}) => (
    {...payload, isFetching: false}
  )
}, {});

const EditorStates = {
  EDIT: 'editForm',
  PREVIEW: 'preview',
  PENDING: 'pending'
};

function _editorStateReceive({state, pending}) {
  const pendingCount = pending - 1;
  return ({
    state: state === EditorStates.PENDING && !pendingCount ? EditorStates.EDIT : state,
    pending: pendingCount
  });
}

const editorState = handleActions({
  [EditorActions.INIT_NEW_HEARING]: () => ({state: EditorStates.PENDING}),
  [EditorActions.BEGIN_EDIT_HEARING]: () => ({state: EditorStates.PENDING}),
  [EditorActions.RECEIVE_META_DATA]: _editorStateReceive,
  receiveHearing: _editorStateReceive,
  [EditorActions.FETCH_META_DATA]: ({pending}) => ({pending: pending + 1}),
  beginFetchHearing: ({pending}) => ({pending: pending + 1, state: EditorStates.PENDING}),
  [EditorActions.SHOW_EDITOR]: () => EditorStates.EDIT,
  [EditorActions.CLOSE_EDITOR]: () => EditorStates.PREVIEW,
  [EditorActions.POST_HEARING_SUCCESS]: () => EditorStates.PREVIEW
}, {state: null, pending: 0});

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

const pendingRequests = handleActions({
  [EditorActions.FETCH_META_DATA]: (state) => state + 1,
  [EditorActions.RECEIVE_META_DATA]: (state) => state - 1,
  beginFetchHearing: (state) => state + 1,
  receiveHearing: (state) => state - 1,
}, 0);

const sections = handleActions({
}, {});

const reducer = combineReducers({
  hearing,
  sections,
  languages,
  metaData,
  editorState,
  errors,
  isPosting,
  pendingRequests
});

export default reducer;
