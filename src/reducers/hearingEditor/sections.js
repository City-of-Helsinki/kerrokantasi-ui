// @flow
import { combineReducers } from 'redux';
import { combineActions, handleActions } from 'redux-actions';
import keys from 'lodash/keys';
import find from 'lodash/find';
import omit from 'lodash/omit';
import size from 'lodash/size';
import { EditorActions } from '../../actions/hearingEditor';
import { getMainImage } from '../../utils/section';
import { initSingleChoiceQuestion, initMultipleChoiceQuestion } from '../../utils/questions';
// import {getOrCreateSectionByID} from '../../utils/hearing';
// import type {SectionState} from '../../types';

const SECTIONS = 'sections';

/* REDUCERS */

const byId = handleActions(
  {
    [combineActions(
      EditorActions.RECEIVE_HEARING,
      EditorActions.INIT_NEW_HEARING,
      EditorActions.UPDATE_HEARING_AFTER_SAVE,
    )]: (state, { payload: { entities } }) => entities[SECTIONS] || {},
    [EditorActions.EDIT_SECTION]: (state, { payload: { sectionID, field, value } }) => ({
      ...state,
      [sectionID]: {
        ...state[sectionID],
        [field]: value,
      },
    }),
    [EditorActions.EDIT_QUESTION]: (state, { payload: {fieldType, sectionId, questionId, value, optionKey} }) => {
      const question = find(state[sectionId].questions, (quest) => quest.frontId === questionId);
      if (fieldType === 'option') {
        question.options[optionKey] = value;
      } else if (fieldType === 'text') {
        question.text = value;
      }
      const section = state[sectionId];
      section.questions = [question];
      return {
        ...state,
        [sectionId]: section
      };
    },
    [EditorActions.ADD_SECTION]: (state, { payload: { section } }) => ({
      ...state,
      [section.frontId]: section,
    }),
    [EditorActions.REMOVE_SECTION]: (state, { payload: { sectionID } }) => {
      const newState = { ...state };
      delete newState[sectionID];
      return newState;
    },
    [EditorActions.INIT_SINGLECHOICE_QUESTION]: (state, {payload: {sectionId}}) => {
      const section = {...state[sectionId], questions: [initSingleChoiceQuestion()]};
      return {
        ...state,
        [sectionId]: section,
      };
    },
    [EditorActions.INIT_MULTIPLECHOICE_QUESTION]: (state, {payload: {sectionId}}) => {
      const section = {...state[sectionId], questions: [initMultipleChoiceQuestion()]};
      return {
        ...state,
        [sectionId]: section,
      };
    },
    [EditorActions.CLEAR_QUESTIONS]: (state, {payload: {sectionId}}) => {
      const section = {...state[sectionId], questions: []};
      return {
        ...state,
        [sectionId]: section,
      };
    },
    [EditorActions.ADD_OPTION]: (state, {payload: {sectionId, questionId}}) => {
      const question = find(state[sectionId].questions, (quest) => quest.frontId === questionId);
      question.options[size(question.options) + 1] = {};
      const section = state[sectionId];
      section.questions = [question];
      return {
        ...state,
        [sectionId]: section
      };
    },
    [EditorActions.DELETE_LAST_OPTION]: (state, {payload: {sectionId, questionId}}) => {
      const question = find(state[sectionId].questions, (quest) => quest.frontId === questionId);
      const newOptions = omit(question.options, [(size(question.options)).toString()]);
      question.options = newOptions;
      const section = state[sectionId];
      section.questions = [...section.questions.filter((quest) => quest.frontId !== questionId), question];
      return {
        ...state,
        [sectionId]: section
      };
    },
    [EditorActions.EDIT_SECTION_MAIN_IMAGE]: (state, { payload: { sectionID, field, value } }) => {
      const section = {...state[sectionID], images: [...state[sectionID].images]};
      const image = {...getMainImage(section)};
      image[field] = value;
      if (field === 'image') {
        // Only one of the two fields should have valid reference to an image.
        image.url = '';
      }
      section.images = [image];
      return {
        ...state,
        [sectionID]: section,
      };
    },
  },
  {},
);

const all = handleActions(
  {
    [combineActions(EditorActions.RECEIVE_HEARING, EditorActions.INIT_NEW_HEARING)]: (
      state,
      { payload: { entities } },
    ) => keys(entities.sections),
    [EditorActions.ADD_SECTION]: (state, { payload: { section } }) => [...state, section.frontId],
    [EditorActions.UPDATE_HEARING_AFTER_SAVE]: (state, { payload: { entities } }) => keys(entities.sections),
  },
  [],
);

const isFetching = () => false;

const reducer = combineReducers({
  byId,
  all,
  isFetching,
});

export default reducer;
