import {handleActions} from 'redux-actions';
import {combineReducers} from 'redux';
import {cloneDeep, findIndex} from 'lodash';

import {initNewHearing, getOrCreateSectionByID} from '../utils/hearing';
import {getMainImage} from '../utils/section';
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
  },
  [EditorActions.EDIT_SECTION_MAIN_IMAGE]: (state, {payload}) => {
    const hearing = cloneDeep(state);
    const {sectionID, field, value} = payload;
    const section = getOrCreateSectionByID(hearing, sectionID);
    const image = getMainImage(section);
    if (section.images.length <= 0) {
      section.images.push(image);
    }
    image[field] = value;
    if (field === "image") {
      // Only one of the two fields should have valid reference to an image.
      image.url = "";
    }
    return Object.assign({}, state, hearing);
  },
  [EditorActions.POST_HEARING_SUCCESS]: (state, {payload: {hearing}}) => hearing,
  [EditorActions.SAVE_HEARING_SUCCESS]: (state, {payload: {hearing}}) => hearing,
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

// export const EditorStates = {
//   EDIT: 'editForm',
//   PREVIEW: 'preview',
//   PENDING: 'pending'
// };
//
// function _editorStateReceive({state, pending}) {
//   const pendingCount = pending - 1;
//   return ({
//     state: state === EditorStates.PENDING && !pendingCount ? EditorStates.EDIT : state,
//     pending: pendingCount
//   });
// }

// const editorState2 = handleActions({
//   [EditorActions.INIT_NEW_HEARING]: () => ({state: EditorStates.PENDING}),
//   [EditorActions.BEGIN_EDIT_HEARING]: () => ({state: EditorStates.PENDING}),
//   [EditorActions.RECEIVE_META_DATA]: _editorStateReceive,
//   receiveHearing: _editorStateReceive,
//   [EditorActions.FETCH_META_DATA]: ({pending}) => ({pending: pending + 1}),
//   beginFetchHearing: ({pending}) => ({pending: pending + 1}),
//   [EditorActions.SHOW_FORM]: () => ({state: EditorStates.EDIT}),
//   [EditorActions.CLOSE_FORM]: () => ({state: EditorStates.PREVIEW}),
//   [EditorActions.POST_HEARING_SUCCESS]: () => ({state: EditorStates.PREVIEW}),
//   [EditorActions.SAVE_HEARING_SUCCESS]: () => ({state: EditorStates.PREVIEW}),
// }, {
//   show: false,
//   pending: 0,
//   isSaving: false
// });

const showEditor = handleActions({
  [EditorActions.BEGIN_EDIT_HEARING]: () => true,
  [EditorActions.INIT_NEW_HEARING]: () => true,
  [EditorActions.SHOW_FORM]: () => true,
  [EditorActions.CLOSE_FORM]: () => false,
}, false);

const editorPending = handleActions({
  beginFetchHearing: (state) => state + 1,
  receiveHearing: (state) => state - 1,
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


const reducer = combineReducers({
  hearing,
  languages,
  metaData,
  editorState,
  errors,
});

export default reducer;
