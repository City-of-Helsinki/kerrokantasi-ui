import uuid from 'uuid/v1';

export const initSingleChoiceQuestion = () => ({
  frontId: uuid(),
  type: 'single-choice',
  independent_poll: false,
  text: {},
  options: [{}, {}]
});

export const initMultipleChoiceQuestion = () => ({
  frontId: uuid(),
  type: 'multiple-choice',
  independent_poll: false,
  text: {},
  options: [{}, {}]
});
