import uuid from 'uuid/v1';

export const initSingleChoiceQuestion = () => ({
  frontId: uuid(),
  type: 'single-choice',
  independent_poll: false,
  text: {},
  options: {
    1: {},
    2: {}
  }
});

export const initMultipleChoiceQuestion = () => ({
  frontId: uuid(),
  type: 'multiple-choice',
  independent_poll: false,
  text: {},
  options: {
    1: {},
    2: {}
  }
});
