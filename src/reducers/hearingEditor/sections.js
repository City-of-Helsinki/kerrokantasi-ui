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
    [EditorActions.ADD_ATTACHMENT]: (state, { payload: { sectionId, attachment }}) => {
      const updatedSection = updeep({
        files: [...state[sectionId].files, attachment]
      }, state[sectionId]);
      return {
        ...state,
        [sectionId]: updatedSection,
      };
    },
    [EditorActions.ORDER_ATTACHMENTS]: (state, {payload: {sectionId, attachments}}) => {
      const newOrder = state[sectionId].files.map((file) => {
        const matchingAttachment = attachments.find((attachment) => attachment.id === file.id);
        if (matchingAttachment) return matchingAttachment;
        return file;
      });
      const updatedSection = updeep({
        files: newOrder.sort((prev, curr) => {
          if (prev.ordering > curr.ordering) return 1;
          if (prev.ordering < curr.ordering) return -1;
          return 0;
        })
      }, state[sectionId]);

      return {
        ...state,
        [sectionId]: updatedSection,
      };
    },
    [EditorActions.EDIT_SECTION_ATTACHMENT]: (state, {payload: {sectionId, attachment}}) => {
      const updatedFile = state[sectionId].files.map((file) => {
        if (file.id === attachment.id) return attachment;
        return file;
      });

      const updatedSection = updeep({
        files: updatedFile,
      }, state[sectionId]);
      return {
        ...state,
        [sectionId]: updatedSection,
      };
    },
    [EditorActions.EDIT_QUESTION]: (state, { payload: {fieldType, sectionId, questionId, optionKey, value} }) => {
      // only search for question with frontId which means the newly generated one.
      // editing is not possible for old questions
      let question = find(
        state[sectionId].questions,
        (quest) => quest.frontId === questionId || quest.id === questionId
      );

      const updatedQuestions = state[sectionId].questions.reduce((acc, curr) => {
        if (curr.frontId === questionId || curr.id === questionId) {
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
          acc.push(question);
        } else {
          acc.push(curr);
        }
        return acc;
      }, []);

      return updeep({
        [sectionId]: {
          questions: updatedQuestions
        }
      }, state);
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
      return updeep({
        [sectionId]: {
          questions: [...state[sectionId].questions, initSingleChoiceQuestion()]
        }
      }, state);
    },
    [EditorActions.INIT_MULTIPLECHOICE_QUESTION]: (state, {payload: {sectionId}}) => {
      return updeep({
        [sectionId]: {
          questions: [...state[sectionId].questions, initMultipleChoiceQuestion()]
        }
      }, state);
    },
    [EditorActions.CLEAR_QUESTIONS]: (state, {payload: {sectionId}}) => {
      const section = {...state[sectionId], questions: []};
      return {
        ...state,
        [sectionId]: section,
      };
    },
    [EditorActions.ADD_OPTION]: (state, {payload: {sectionId, questionId}}) => {
      const index = findIndex(
        state[sectionId].questions,
        (quest) => quest.frontId === questionId || quest.id === questionId
      );
      const question = state[sectionId].questions[index];
      return updeep({
        [sectionId]: {
          questions: {
            [index]: {
              options: [...question.options, {}]
            }
          }
        }
      }, state);
    },
    [EditorActions.DELETE_LAST_OPTION]: (state, {payload: {sectionId, questionId}}) => {
      const index = findIndex(
        state[sectionId].questions,
        (quest) => quest.frontId === questionId || quest.id === questionId
      );
      const question = state[sectionId].questions[index];
      const newOptions = question.options.slice(0, -1);
      return updeep({
        [sectionId]: {
          questions: {
            [index]: {
              options: newOptions
            }
          }
        }
      }, state);
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
    [EditorActions.DELETE_EXISTING_QUESTION]: (state, { payload: { sectionId, questionId }}) => {
      const updatedSection = updeep({
        questions: state[sectionId].questions.filter(question => question.id !== questionId)
      }, state[sectionId]);

      return {
        ...state,
        [sectionId]: updatedSection,
      };
    },
    [EditorActions.DELETE_ATTACHMENT]: (state, { payload: { sectionId, attachment }}) => {
      const updatedSection = updeep({
        files: state[sectionId].files.filter(file => file.id !== attachment.id)
      }, state[sectionId]);

      return {
        ...state,
        [sectionId]: updatedSection,
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
