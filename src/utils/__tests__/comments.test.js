// comments.test.js
import { updateAnswers } from '../comments';

describe('updateAnswers', () => {
  it('updates the state correctly for single-choice question', () => {
    const currentAnswers = [];
    const question = 1;
    const questionType = 'single-choice';
    const answer = 'answer1';

    const updatedAnswers = updateAnswers(currentAnswers, question, questionType, answer);

    expect(updatedAnswers).toEqual([{ question: 1, answers: ['answer1'], type: 'single-choice' }]);
  });

  it('updates the state correctly for multiple-choice question', () => {
    const currentAnswers = [{ question: 1, answers: ['answer1'], type: 'multiple-choice' }];
    const question = 1;
    const questionType = 'multiple-choice';
    const answer = 'answer2';

    const updatedAnswers = updateAnswers(currentAnswers, question, questionType, answer);

    expect(updatedAnswers).toEqual([
      { question: 1, answers: ['answer1', 'answer2'], type: 'multiple-choice' },
    ]);
  });

  it('deselects an answer for multiple-choice question', () => {
    const currentAnswers = [{ question: 1, answers: ['answer1', 'answer2'], type: 'multiple-choice' }];
    const question = 1;
    const questionType = 'multiple-choice';
    const answer = 'answer2';

    const updatedAnswers = updateAnswers(currentAnswers, question, questionType, answer);

    expect(updatedAnswers).toEqual([{ question: 1, answers: ['answer1'], type: 'multiple-choice' }]);
  });

  it('adds a new answer if question does not exist', () => {
    const currentAnswers = [];
    const question = 1;
    const questionType = 'single-choice';
    const answer = 'answer1';

    const updatedAnswers = updateAnswers(currentAnswers, question, questionType, answer);

    expect(updatedAnswers).toEqual([{ question: 1, answers: ['answer1'], type: 'single-choice' }]);
  });

  it('updates the state correctly for existing single-choice question', () => {
    const currentAnswers = [{ question: 1, answers: ['answer1'], type: 'single-choice' }];
    const question = 1;
    const questionType = 'single-choice';
    const answer = 'answer2';

    const updatedAnswers = updateAnswers(currentAnswers, question, questionType, answer);

    expect(updatedAnswers).toEqual([{ question: 1, answers: ['answer2'], type: 'single-choice' }]);
  });

  it('updates the state correctly for existing multiple-choice question', () => {
    const currentAnswers = [{ question: 1, answers: ['answer1'], type: 'multiple-choice' }];
    const question = 1;
    const questionType = 'multiple-choice';
    const answer = 'answer2';

    const updatedAnswers = updateAnswers(currentAnswers, question, questionType, answer);

    expect(updatedAnswers).toEqual([
      { question: 1, answers: ['answer1', 'answer2'], type: 'multiple-choice' },
    ]);
  });

  it('removes the answer if it is already selected for multiple-choice question', () => {
    const currentAnswers = [{ question: 1, answers: ['answer1', 'answer2'], type: 'multiple-choice' }];
    const question = 1;
    const questionType = 'multiple-choice';
    const answer = 'answer2';

    const updatedAnswers = updateAnswers(currentAnswers, question, questionType, answer);

    expect(updatedAnswers).toEqual([{ question: 1, answers: ['answer1'], type: 'multiple-choice' }]);
  });
});