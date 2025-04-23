import { createStore } from 'redux';

import sections from '../hearingEditor/sections';
import { EditorActions } from '../../actions/hearingEditor';

const INITIAL_STATE = {
  all: ['abc'],
  byId: {
    abc: {
      title: { fi: 'first section' },
      images: [{ url: 'urlofthepicture.foo', alt: '' }],
      files: [],
      questions: [
        {
          id: 29,
          independent_poll: false,
          options: [
            {
              id: 1,
              text: { en: 'first' }
            },
            {
              id: 2,
              text: { en: 'second' }
            },
          ],
          text: {
            en: 'Which of these?'
          },
          n_answers: 0,
          type: 'single-choice'
        },
        {
          id: 30,
          independent_poll: false,
          options: [
            {
              id: 11,
              text: { en: 'alpha' }
            },
            {
              id: 22,
              text: { en: 'beta' }
            },
            {
              id: 33,
              text: { en: 'gamma' }
            },
            {
              id: 44,
              text: { en: 'delta' }
            },
            {
              id: 55,
              text: { en: 'epsilon' }
            },
          ],
          text: {
            en: 'Select all applicable options?'
          },
          n_answers: 0,
          type: 'multiple-choice'
        }
      ]
    },
  }
};

const TITLE_IS_THIS_SECOND = "is this second?";

describe('sections', () => {
  describe('HEARING', () => {
    let store;
    const entities = {
      sections: { firstSectionId: {}, secondSectionId: {} }
    };
    beforeEach(() => {
      store = createStore(sections);
    });

    it('should dispatch RECEIVE_HEARING', () => {
      store.dispatch({ type: EditorActions.RECEIVE_HEARING, payload: { entities } });
      expect(store.getState().all).toEqual(Object.keys(entities.sections));
      expect(store.getState().byId).toEqual(entities.sections);
    });

    it('should dispatch INIT_NEW_HEARING', () => {
      store.dispatch({ type: EditorActions.INIT_NEW_HEARING, payload: { entities } });
      expect(store.getState().all).toEqual(Object.keys(entities.sections));
      expect(store.getState().byId).toEqual(entities.sections);
    });

    it('should dispatch UPDATE_HEARING_AFTER_SAVE', () => {
      store.dispatch({ type: EditorActions.UPDATE_HEARING_AFTER_SAVE, payload: { entities } });
      expect(store.getState().all).toEqual(Object.keys(entities.sections));
      expect(store.getState().byId).toEqual(entities.sections);
    });
  });

  describe('SECTION', () => {
    let store;

    beforeEach(() => {
      store = createStore(sections, INITIAL_STATE);
    });

    afterEach(() => {
      store = null;
    });

    it('should dispatch EDIT_SECTION', () => {
      const sectionID = 'abc';
      const field = 'title';
      const value = { fi: 'modified title' };

      expect(store.getState().byId[sectionID][field]).toEqual(INITIAL_STATE.byId[sectionID][field]);
      store.dispatch({ type: EditorActions.EDIT_SECTION, payload: { sectionID, field, value } });
      expect(store.getState().byId[sectionID][field]).toEqual(value);
    });

    it('should dispatch ADD_SECTION', () => {
      const section = { frontId: 'xyz' };
      const expectedKeys = [...INITIAL_STATE.all];

      expect(store.getState().all).toEqual(expectedKeys);
      expect(Object.keys(store.getState().byId)).toEqual(expectedKeys);
      store.dispatch({ type: EditorActions.ADD_SECTION, payload: { section } });
      expectedKeys.push('xyz');
      expect(store.getState().all).toEqual(expectedKeys);
      expect(Object.keys(store.getState().byId)).toEqual(expectedKeys);
    });

    it('should dispatch REMOVE_SECTION', () => {
      expect(store.getState().all).toEqual(INITIAL_STATE.all);
      const section = { frontId: 'addedSection' };
      const sectionID = section.frontId;
      store.dispatch({ type: EditorActions.ADD_SECTION, payload: { section } });
      // should contain the original section + the added one
      expect(store.getState().all).toEqual([...INITIAL_STATE.all, section.frontId]);
      expect(Object.keys(store.getState().byId)).toEqual([...Object.keys(INITIAL_STATE.byId), section.frontId]);
      store.dispatch({ type: EditorActions.REMOVE_SECTION, payload: { sectionID } });
      // should only contain the original section
      expect(Object.keys(store.getState().byId)).toEqual([...Object.keys(INITIAL_STATE.byId)]);
    });

    it('should dispatch SET_SECTION_MAIN_IMAGE', () => {
      const sectionID = INITIAL_STATE.all[0];
      const mockImage = 'mockimage';

      expect(store.getState().byId[sectionID].images).toEqual(INITIAL_STATE.byId[sectionID].images);

      store.dispatch({ type: EditorActions.SET_SECTION_MAIN_IMAGE, payload: { sectionID, value: mockImage } });

      expect(store.getState().byId[sectionID].images[0].image).toEqual(mockImage);
    });

    it('should dispatch DELETE_SECTION_MAIN_IMAGE', () => {
      const sectionID = INITIAL_STATE.all[0];

      expect(store.getState().byId[sectionID].images).toEqual(INITIAL_STATE.byId[sectionID].images);

      store.dispatch({ type: EditorActions.DELETE_SECTION_MAIN_IMAGE, payload: { sectionID } });

      expect(store.getState().byId[sectionID].images[0]).not.toBeDefined();
    });

    it('should dispatch CHANGE_SECTION_MAIN_IMAGE_CAPTION', () => {
      const sectionID = INITIAL_STATE.all[0];
      const mockCaption = 'caption';

      expect(store.getState().byId[sectionID].images).toEqual(INITIAL_STATE.byId[sectionID].images);

      store.dispatch({ type: EditorActions.CHANGE_SECTION_MAIN_IMAGE_CAPTION, payload: { sectionID, value: mockCaption } });

      expect(store.getState().byId[sectionID].images[0].caption).toEqual(mockCaption);
    });
  });

  describe('ATTACHMENT', () => {
    let store;
    const sectionId = INITIAL_STATE.all[0];

    beforeEach(() => {
      store = createStore(sections, INITIAL_STATE);
    });

    afterEach(() => {
      store = null;
    });

    it('should dispatch ADD_ATTACHMENT', () => {
      const attachment = { id: 123 };
      expect(store.getState().byId[sectionId].files).toEqual([]);
      store.dispatch({ type: EditorActions.ADD_ATTACHMENT, payload: { sectionId, attachment } });
      expect(store.getState().byId[sectionId].files).toEqual([attachment]);
    });

    it('should dispatch DELETE_ATTACHMENT', () => {
      const FILES = [{ id: 123, title: 'first' }, { id: 456, title: TITLE_IS_THIS_SECOND }];
      let attachment;
      FILES.forEach((file) => {
        attachment = file;
        store.dispatch({ type: EditorActions.ADD_ATTACHMENT, payload: { sectionId, attachment } });
      });
      // should contain the added files
      expect(store.getState().byId[sectionId].files).toHaveLength(2);
      expect(store.getState().byId[sectionId].files).toEqual(FILES);
      attachment = { id: 123 };
      store.dispatch({ type: EditorActions.DELETE_ATTACHMENT, payload: { sectionId, attachment } });
      // should only contain the second file that was added as the first one was deleted
      expect(store.getState().byId[sectionId].files).toHaveLength(1);
      expect(store.getState().byId[sectionId].files).toEqual([FILES[1]]);
    });
  });

  describe('QUESTIONS', () => {
    let store;
    let sectionId;
    let section;
    // questionCount is 2 by default
    let questionCount;

    beforeEach(() => {
      store = createStore(sections, INITIAL_STATE);
      sectionId = store.getState().all[0];
      section = store.getState().byId[sectionId];
      questionCount = section.questions.length;
    });

    it('should dispatch INIT_SINGLECHOICE_QUESTION', () => {
      // questionCount is 2 by default
      expect(section.questions).toHaveLength(questionCount);
      // add a single choice question
      store.dispatch({ type: EditorActions.INIT_SINGLECHOICE_QUESTION, payload: { sectionId } });
      section = store.getState().byId[sectionId];
      // amount of questions should be default + 1
      expect(section.questions).toHaveLength(questionCount + 1);
      // last question(the added one) should have single-choice type
      expect(section.questions.slice(-1)[0].type).toBe('single-choice');
    });

    it('should dispatch INIT_MULTIPLECHOICE_QUESTION', () => {
      expect(section.questions).toHaveLength(questionCount);
      // add a multiple choice question
      store.dispatch({ type: EditorActions.INIT_MULTIPLECHOICE_QUESTION, payload: { sectionId } });
      section = store.getState().byId[sectionId];
      // amount of questions should be default + 1
      expect(section.questions).toHaveLength(questionCount + 1);
      // last question(the added one) should have multiple-choice type
      expect(section.questions.slice(-1)[0].type).toBe('multiple-choice');
    });

    it('should dispatch CLEAR_QUESTIONS', () => {
      expect(section.questions).toHaveLength(questionCount);
      store.dispatch({ type: EditorActions.CLEAR_QUESTIONS, payload: { sectionId } });
      section = store.getState().byId[sectionId];
      expect(section.questions).toHaveLength(0);
    });

    it('should dispatch DELETE_TEMP_QUESTION', () => {
      expect(section.questions).toHaveLength(questionCount);
      // add a single choice question, newly added questions have frontId key instead of the id key
      store.dispatch({ type: EditorActions.INIT_SINGLECHOICE_QUESTION, payload: { sectionId } });
      section = store.getState().byId[sectionId];
      expect(section.questions).toHaveLength(questionCount + 1);
      const questionFrontId = section.questions[2].frontId;
      // delete the newly added question
      store.dispatch({ type: EditorActions.DELETE_TEMP_QUESTION, payload: { sectionId, questionFrontId } });
      section = store.getState().byId[sectionId];
      expect(section.questions).toHaveLength(questionCount);
    });

    it('should dispatch DELETE_EXISTING_QUESTION', () => {
      expect(section.questions).toHaveLength(questionCount);
      expect(section.questions).toEqual(INITIAL_STATE.byId[sectionId].questions);
      // questions that have been saved use/have the id key
      const questionId = section.questions[0].id;
      // delete the first question
      store.dispatch({ type: EditorActions.DELETE_EXISTING_QUESTION, payload: { sectionId, questionId } });
      section = store.getState().byId[sectionId];
      expect(section.questions).toHaveLength(questionCount - 1);
      // only the second question should remain
      expect(section.questions).toEqual([INITIAL_STATE.byId[sectionId].questions[1]]);
    });

    it('should dispatch EDIT_QUESTION', () => {
      let questionId = store.getState().byId[sectionId].questions[0].id; // id of the first question
      let fieldType = 'text'; // update the questions text
      let value = { en: 'WHICH IS IT?!' };
      let optionKey = 1; // key of the option that is updated
      // edit question text
      expect(section.questions[0].text)
        .toEqual(INITIAL_STATE.byId[sectionId].questions[0].text);
      store.dispatch(
        {
          type: EditorActions.EDIT_QUESTION,
          payload: { fieldType, sectionId, questionId, optionKey, value }
        }
      );
      section = store.getState().byId[sectionId];
      expect(section.questions[0].text).toEqual(value);

      // edit option text
      questionId = store.getState().byId[sectionId].questions[1].id; // id of the second question
      fieldType = 'option'; // update an options text
      value = { en: 'omega' };
      optionKey = 2; // updating the third value of the array
      section = store.getState().byId[sectionId];

      // expect option text to be initial state
      expect(section.questions[1].options[optionKey].text)
        .toEqual(INITIAL_STATE.byId[sectionId].questions[1].options[optionKey].text);
      store.dispatch(
        {
          type: EditorActions.EDIT_QUESTION,
          payload: { fieldType, sectionId, questionId, optionKey, value }
        }
      );
      section = store.getState().byId[sectionId];
      // expect option text to be value
      expect(section.questions[1].options[optionKey].text).toEqual(value);
    });

    it('should dispatch ADD_OPTION AND DELETE_LAST_OPTION', () => {
      const questionId = store.getState().byId[sectionId].questions[0].id;
      // add 2 options
      expect(section.questions[0].options).toHaveLength(questionCount);
      store.dispatch({ type: EditorActions.ADD_OPTION, payload: { sectionId, questionId } });
      section = store.getState().byId[sectionId];
      expect(section.questions[0].options).toHaveLength(questionCount + 1);
      store.dispatch({ type: EditorActions.ADD_OPTION, payload: { sectionId, questionId } });
      section = store.getState().byId[sectionId];
      expect(section.questions[0].options).toHaveLength(questionCount + 2);

      // delete 2 options
      store.dispatch({ type: EditorActions.DELETE_LAST_OPTION, payload: { sectionId, questionId } });
      section = store.getState().byId[sectionId];
      expect(section.questions[0].options).toHaveLength(questionCount + 1);
      store.dispatch({ type: EditorActions.DELETE_LAST_OPTION, payload: { sectionId, questionId } });
      section = store.getState().byId[sectionId];
      expect(section.questions[0].options).toHaveLength(questionCount);
    });
  });
});
