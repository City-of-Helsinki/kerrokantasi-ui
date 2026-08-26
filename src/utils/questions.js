import { v1 as uuid } from 'uuid';

export const initSingleChoiceQuestion = () => ({
  frontId: uuid(),
  type: 'single-choice',
  independent_poll: false,
  text: {},
  options: [{ frontId: uuid() }, { frontId: uuid() }],
});

export const initMultipleChoiceQuestion = () => ({
  frontId: uuid(),
  type: 'multiple-choice',
  independent_poll: false,
  text: {},
  options: [{ frontId: uuid() }, { frontId: uuid() }],
});
