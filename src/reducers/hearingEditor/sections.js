// @flow
import {combineReducers} from 'redux';
import {combineActions, handleActions} from 'redux-actions';

import {EditorActions} from '../../actions/hearingEditor';
import {getMainImage} from '../../utils/section';
// import {getOrCreateSectionByID} from '../../utils/hearing';
// import type {SectionState} from '../../types';

const SECTIONS = 'sections';


/* REDUCERS */

const byId = handleActions({
  [combineActions(
    EditorActions.RECEIVE_HEARING,
    EditorActions.INIT_NEW_HEARING,
  )]: (state, {payload: {entities}}) => entities[SECTIONS] || {},
  [EditorActions.EDIT_SECTION]: (state, {payload: {sectionID, field, value}}) =>
  (
    {
      ...state,
      [sectionID]: {
        ...state[sectionID],
        [field]: value,
      }
    }
  ),
  [EditorActions.ADD_SECTION]: (state, {payload: {section}}) => ({
    ...state,
    [section.frontId]: section,
  }),
  [EditorActions.REMOVE_SECTION]: (state, {payload: {sectionID}}) => {
    const newState = {...state};
    delete newState[sectionID];
    return newState;
  },
  [EditorActions.EDIT_SECTION_MAIN_IMAGE]: (state, {payload: {sectionID, field, value}}) => {
    const section = {...state[sectionID]};
    const image = getMainImage(section);
    if (section.images.length <= 0) {
      section.images.push(image);
    }
    image[field] = value;
    if (field === 'image') {
      // Only one of the two fields should have valid reference to an image.
      image.url = '';
    }
    return {
      ...state,
      [sectionID]: section,
    };
  }
}, {});

const all = handleActions({
  [combineActions(
    EditorActions.RECEIVE_HEARING,
    EditorActions.INIT_NEW_HEARING,
  )]: (state, {payload: {entities}}) =>
    Object.keys(entities.sections),
  [EditorActions.ADD_SECTION]: (state, {payload: {section}}) => [
    ...state,
    section.frontId
  ],
  [EditorActions.UPDATE_HEARING_AFTER_SAVE]: (state, {payload: {entities}}) => {
    return [...new Set([...state, ...Object.keys(entities.sections)])];
  }
}, []);

const isFetching = () => false;

const reducer = combineReducers({
  byId,
  all,
  isFetching,
});

export default reducer;
