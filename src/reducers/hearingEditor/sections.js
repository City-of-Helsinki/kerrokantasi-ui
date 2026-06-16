import { combineReducers, createReducer } from '@reduxjs/toolkit';
import keys from 'lodash/keys';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';

import { EditorActions } from '../../actions/hearingEditor';
import {
  initSingleChoiceQuestion,
  initMultipleChoiceQuestion,
} from '../../utils/questions';

const SECTIONS = 'sections';

/* REDUCERS */

const byId = createReducer({}, (builder) => {
  builder
    .addCase(
      EditorActions.EDIT_SECTION,
      (state, { payload: { sectionID, field, value } }) => ({
        ...state,
        [sectionID]: {
          ...state[sectionID],
          [field]: value,
        },
      })
    )
    .addCase(
      EditorActions.ADD_ATTACHMENT,
      (state, { payload: { sectionId, attachment } }) => ({
        ...state,
        [sectionId]: {
          ...state[sectionId],
          files: [...state[sectionId].files, attachment],
        },
      })
    )
    .addCase(
      EditorActions.EDIT_QUESTION,
      (
        state,
        { payload: { fieldType, sectionId, questionId, optionKey, value } }
      ) => {
        // only search for question with frontId which means the newly generated one.
        // editing is not possible for old questions
        let question = find(
          state[sectionId].questions,
          (quest) => quest.frontId === questionId || quest.id === questionId
        );

        const updatedQuestions = state[sectionId].questions.reduce(
          (acc, curr) => {
            if (curr.frontId === questionId || curr.id === questionId) {
              if (fieldType === 'option') {
                question = {
                  ...question,
                  options: question.options.map((opt, i) =>
                    i === optionKey ? { ...opt, text: value } : opt
                  ),
                };
              } else if (fieldType === 'text') {
                question = { ...question, text: value };
              }
              acc.push(question);
            } else {
              acc.push(curr);
            }
            return acc;
          },
          []
        );

        return {
          ...state,
          [sectionId]: { ...state[sectionId], questions: updatedQuestions },
        };
      }
    )
    .addCase(EditorActions.ADD_SECTION, (state, { payload: { section } }) => ({
      ...state,
      [section.frontId]: section,
    }))
    .addCase(
      EditorActions.REMOVE_SECTION,
      (state, { payload: { sectionID } }) => {
        const newState = { ...state };
        delete newState[sectionID];
        return newState;
      }
    )
    .addCase(
      EditorActions.INIT_SINGLECHOICE_QUESTION,
      (state, { payload: { sectionId } }) => ({
        ...state,
        [sectionId]: {
          ...state[sectionId],
          questions: [...state[sectionId].questions, initSingleChoiceQuestion()],
        },
      })
    )
    .addCase(
      EditorActions.INIT_MULTIPLECHOICE_QUESTION,
      (state, { payload: { sectionId } }) => ({
        ...state,
        [sectionId]: {
          ...state[sectionId],
          questions: [
            ...state[sectionId].questions,
            initMultipleChoiceQuestion(),
          ],
        },
      })
    )
    .addCase(
      EditorActions.CLEAR_QUESTIONS,
      (state, { payload: { sectionId } }) => {
        const section = { ...state[sectionId], questions: [] };
        return {
          ...state,
          [sectionId]: section,
        };
      }
    )
    .addCase(
      EditorActions.ADD_OPTION,
      (state, { payload: { sectionId, questionId } }) => {
        const index = findIndex(
          state[sectionId].questions,
          (quest) => quest.frontId === questionId || quest.id === questionId
        );
        return {
          ...state,
          [sectionId]: {
            ...state[sectionId],
            questions: state[sectionId].questions.map((q, i) =>
              i === index ? { ...q, options: [...q.options, {}] } : q
            ),
          },
        };
      }
    )
    .addCase(
      EditorActions.DELETE_LAST_OPTION,
      (state, { payload: { sectionId, questionId } }) => {
        const index = findIndex(
          state[sectionId].questions,
          (quest) => quest.frontId === questionId || quest.id === questionId
        );
        return {
          ...state,
          [sectionId]: {
            ...state[sectionId],
            questions: state[sectionId].questions.map((q, i) =>
              i === index ? { ...q, options: q.options.slice(0, -1) } : q
            ),
          },
        };
      }
    )
    .addCase(
      EditorActions.DELETE_TEMP_QUESTION,
      (state, { payload: { sectionId, questionFrontId } }) => ({
        ...state,
        [sectionId]: {
          ...state[sectionId],
          questions: state[sectionId].questions.filter(
            (quest) => quest.frontId !== questionFrontId
          ),
        },
      })
    )
    .addCase(
      EditorActions.DELETE_EXISTING_QUESTION,
      (state, { payload: { sectionId, questionId } }) => ({
        ...state,
        [sectionId]: {
          ...state[sectionId],
          questions: state[sectionId].questions.filter(
            (question) => question.id !== questionId
          ),
        },
      })
    )
    .addCase(
      EditorActions.DELETE_ATTACHMENT,
      (state, { payload: { sectionId, attachment } }) => ({
        ...state,
        [sectionId]: {
          ...state[sectionId],
          files: state[sectionId].files.filter(
            (file) => file.id !== attachment.id
          ),
        },
      })
    )
    .addCase(
      EditorActions.SET_SECTION_MAIN_IMAGE,
      (state, { payload: { sectionID, value } }) => {
        const setSection = {
          ...state[sectionID],
          images: [{ image: value, url: '', caption: '' }],
        };

        return { ...state, [sectionID]: setSection };
      }
    )
    .addCase(
      EditorActions.DELETE_SECTION_MAIN_IMAGE,
      (state, { payload: { sectionID } }) => {
        const setSection = { ...state[sectionID], images: [] };

        return { ...state, [sectionID]: setSection };
      }
    )
    .addCase(
      EditorActions.CHANGE_SECTION_MAIN_IMAGE_CAPTION,
      (state, { payload: { sectionID, value } }) => {
        if (!state[sectionID].images.length) {
          return state;
        }

        const setSection = {
          ...state[sectionID],
          images: [{ ...state[sectionID].images[0], caption: value }],
        };

        return { ...state, [sectionID]: setSection };
      }
    )
    .addCase(
      EditorActions.RECEIVE_HEARING,
      (_state, { payload: { entities } }) => entities[SECTIONS] || {}
    )
    .addCase(
      EditorActions.INIT_NEW_HEARING,
      (_state, { payload: { entities } }) => entities[SECTIONS] || {}
    )
    .addCase(
      EditorActions.UPDATE_HEARING_AFTER_SAVE,
      (_state, { payload: { entities } }) => entities[SECTIONS] || {}
    );
});

const all = createReducer([], (builder) => {
  builder
    .addCase(EditorActions.ADD_SECTION, (state, { payload: { section } }) => [
      ...state,
      section.frontId,
    ])
    .addCase(
      EditorActions.RECEIVE_HEARING,
      (_state, { payload: { entities } }) => keys(entities.sections)
    )
    .addCase(
      EditorActions.INIT_NEW_HEARING,
      (_state, { payload: { entities } }) => keys(entities.sections)
    )
    .addCase(
      EditorActions.UPDATE_HEARING_AFTER_SAVE,
      (_state, { payload: { entities } }) => keys(entities.sections)
    );
});

const isFetching = () => false;

const reducer = combineReducers({
  byId,
  all,
  isFetching,
});

export default reducer;
