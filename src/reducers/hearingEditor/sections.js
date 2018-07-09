// @flow
import { combineReducers } from 'redux';
import { combineActions, handleActions } from 'redux-actions';
import updeep from 'updeep';
import keys from 'lodash/keys';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
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
    [EditorActions.EDIT_QUESTION]: (state, { payload: {fieldType, sectionId, questionId, optionKey, value} }) => {
      // only search for question with frontId which means the newly generated one.
      // editing is not possible for old questions
      let question = find(state[sectionId].questions, (quest) => quest.frontId === questionId);
      if (fieldType === 'option') {
        question = updeep({
          options: {[optionKey]: {
            text: value
          }}
        }, question);
      } else if (fieldType === 'text') {
        question = updeep({
          text: value
        }, question);
      }
      const updatedSection = updeep({
        questions: [...state[sectionId].questions.filter(quest => quest.frontId !== questionId), question]
      }, state[sectionId]);
      return {
        ...state,
        [sectionId]: updatedSection
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
      const section = {...state[sectionId], questions: [initSingleChoiceQuestion(), ...state[sectionId].questions]};
      return {
        ...state,
        [sectionId]: section,
      };
    },
    [EditorActions.INIT_MULTIPLECHOICE_QUESTION]: (state, {payload: {sectionId}}) => {
      const section = {...state[sectionId], questions: [initMultipleChoiceQuestion(), ...state[sectionId].questions]};
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
      const index = findIndex(state[sectionId].questions, (quest) => quest.frontId === questionId);
      const question = state[sectionId].questions[index];
      const updatedQuestion = updeep({
        options: [...question.options, {}]
      }, question);
      const updatedSection = updeep({
        questions: { [index]: updatedQuestion }
      }, state[sectionId]);
      return {
        ...state,
        [sectionId]: updatedSection
      };
    },
    [EditorActions.DELETE_LAST_OPTION]: (state, {payload: {sectionId, questionId}}) => {
      const index = findIndex(state[sectionId].questions, (quest) => quest.frontId === questionId);
      const question = state[sectionId].questions[index];
      const newOptions = question.options.slice(0, -1);
      const updatedQuestion = updeep({
        options: newOptions
      }, question);
      const updatedSection = updeep({
        questions: { [index]: updatedQuestion }
      }, state[sectionId]);
      return {
        ...state,
        [sectionId]: updatedSection
      };
    },
    [EditorActions.DELETE_TEMP_QUESTION]: (state, {payload: {sectionId, questionFrontId}}) => {
      const updatedSection = updeep({
        questions: state[sectionId].questions.filter(quest => quest.frontId !== questionFrontId)
      }, state[sectionId]);
      return {
        ...state,
        [sectionId]: updatedSection
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
