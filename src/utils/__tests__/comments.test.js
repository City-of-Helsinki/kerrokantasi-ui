import updateAnswers from '../comments';

const QUESTION_ID = 1;
const SINGLE_CHOICE = 'single-choice';
const MULTIPLE_CHOICE = 'multiple-choice';
const ANSWER1 = 'answer1';
const ANSWER2 = 'answer2';

describe('updateAnswers', () => {
  it('updates the state correctly for single-choice question', () => {
    const currentAnswers = [];
    const question = QUESTION_ID;
    const questionType = SINGLE_CHOICE;
    const answer = ANSWER1;

    const updatedAnswers = updateAnswers(currentAnswers, question, questionType, answer);

    expect(updatedAnswers).toEqual([{ question: QUESTION_ID, answers: [ANSWER1], type: SINGLE_CHOICE }]);
  });

  it('updates the state correctly for multiple-choice question', () => {
    const currentAnswers = [{ question: QUESTION_ID, answers: [ANSWER1], type: MULTIPLE_CHOICE }];
    const question = QUESTION_ID;
    const questionType = MULTIPLE_CHOICE;
    const answer = ANSWER2;

    const updatedAnswers = updateAnswers(currentAnswers, question, questionType, answer);

    expect(updatedAnswers).toEqual([
      { question: QUESTION_ID, answers: [ANSWER1, ANSWER2], type: MULTIPLE_CHOICE },
    ]);
  });

  it('deselects an answer for multiple-choice question', () => {
    const currentAnswers = [{ question: QUESTION_ID, answers: [ANSWER1, ANSWER2], type: MULTIPLE_CHOICE }];
    const question = QUESTION_ID;
    const questionType = MULTIPLE_CHOICE;
    const answer = ANSWER2;

    const updatedAnswers = updateAnswers(currentAnswers, question, questionType, answer);

    expect(updatedAnswers).toEqual([{ question: QUESTION_ID, answers: [ANSWER1], type: MULTIPLE_CHOICE }]);
  });

  it('adds a new answer if question does not exist', () => {
    const currentAnswers = [];
    const question = QUESTION_ID;
    const questionType = SINGLE_CHOICE;
    const answer = ANSWER1;

    const updatedAnswers = updateAnswers(currentAnswers, question, questionType, answer);

    expect(updatedAnswers).toEqual([{ question: QUESTION_ID, answers: [ANSWER1], type: SINGLE_CHOICE }]);
  });

  it('updates the state correctly for existing single-choice question', () => {
    const currentAnswers = [{ question: QUESTION_ID, answers: [ANSWER1], type: SINGLE_CHOICE }];
    const question = QUESTION_ID;
    const questionType = SINGLE_CHOICE;
    const answer = ANSWER2;

    const updatedAnswers = updateAnswers(currentAnswers, question, questionType, answer);

    expect(updatedAnswers).toEqual([{ question: QUESTION_ID, answers: [ANSWER2], type: SINGLE_CHOICE }]);
  });

  it('updates the state correctly for existing multiple-choice question', () => {
    const currentAnswers = [{ question: QUESTION_ID, answers: [ANSWER1], type: MULTIPLE_CHOICE }];
    const question = QUESTION_ID;
    const questionType = MULTIPLE_CHOICE;
    const answer = ANSWER2;

    const updatedAnswers = updateAnswers(currentAnswers, question, questionType, answer);

    expect(updatedAnswers).toEqual([
      { question: QUESTION_ID, answers: [ANSWER1, ANSWER2], type: MULTIPLE_CHOICE },
    ]);
  });

  it('removes the answer if it is already selected for multiple-choice question', () => {
    const currentAnswers = [{ question: QUESTION_ID, answers: [ANSWER1, ANSWER2], type: MULTIPLE_CHOICE }];
    const question = QUESTION_ID;
    const questionType = MULTIPLE_CHOICE;
    const answer = ANSWER2;

    const updatedAnswers = updateAnswers(currentAnswers, question, questionType, answer);

    expect(updatedAnswers).toEqual([{ question: QUESTION_ID, answers: [ANSWER1], type: MULTIPLE_CHOICE }]);
  });
});