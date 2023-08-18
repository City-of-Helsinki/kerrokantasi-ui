import {
  checkFormErrors,
  getFirstUnansweredQuestion,
  hasAnyAnswers,
  hasAnyQuestions,
  hasUserAnsweredAllQuestions,
  hasUserAnsweredQuestions,
  initNewSection,
  isCommentRequired,
  isEmptyCommentAllowed
} from "../../src/utils/section";

function createAnswers() {
  return [
    {
      answers: [],
      question: 1,
      type: "single-choice"
    },
    {
      answers: [],
      question: 2,
      type: "multiple-choice"
    },
  ];
}

const sectionEmpty = initNewSection();
const sectionWithQuestions = initNewSection({questions: [{id: 1}, {id: 2}]});
const answersNone = createAnswers();
const answersAnswered = createAnswers();
answersAnswered[0].answers.push(10);

function createUser(initialValues) {
  const user = {
    adminOrganizations: [],
    answered_questions: [],
    displayName: 'Test Tester',
    favorite_hearings: [],
    hasStrongAuth: false,
    nickname: 'Test'
  };

  return {...user, ...initialValues};
}

describe('section util tests', () => {
  describe('checkFormErrors', () => {
    test('returns correct error array with given params', () => {
      const testCases = [
        {
          imageTooBig: false,
          commentText: '',
          section: sectionEmpty,
          answers: answersNone,
          isReply: false,
          userAnsweredAllQuestions: false,
          expectedResult: ['commentRequiredError']
        },
        {
          imageTooBig: false,
          commentText: '       ',
          section: sectionEmpty,
          answers: answersNone,
          isReply: false,
          userAnsweredAllQuestions: false,
          expectedResult: ['commentRequiredError']
        },
        {
          imageTooBig: true,
          commentText: '       abc   ',
          section: sectionEmpty,
          answers: answersNone,
          isReply: false,
          userAnsweredAllQuestions: false,
          expectedResult: ['imageTooBig']
        },
        {
          imageTooBig: true,
          commentText: '',
          section: sectionEmpty,
          answers: answersNone,
          isReply: false,
          userAnsweredAllQuestions: false,
          expectedResult: ['imageTooBig', 'commentRequiredError']
        },
        {
          imageTooBig: true,
          commentText: '',
          section: sectionWithQuestions,
          answers: answersNone,
          isReply: false,
          userAnsweredAllQuestions: false,
          expectedResult: ['imageTooBig', 'commentOrAnswerRequiredError']
        },
        {
          imageTooBig: false,
          commentText: '',
          section: sectionWithQuestions,
          answers: answersAnswered,
          isReply: false,
          userAnsweredAllQuestions: false,
          expectedResult: []
        },
        {
          imageTooBig: false,
          commentText: '',
          section: sectionWithQuestions,
          answers: answersAnswered,
          isReply: true,
          userAnsweredAllQuestions: false,
          expectedResult: ['commentRequiredError']
        },
        {
          imageTooBig: false,
          commentText: '',
          section: sectionWithQuestions,
          answers: answersAnswered,
          isReply: false,
          userAnsweredAllQuestions: false,
          expectedResult: []
        },
        {
          imageTooBig: false,
          commentText: '',
          section: sectionWithQuestions,
          answers: answersAnswered,
          isReply: false,
          userAnsweredAllQuestions: true,
          expectedResult: ['commentRequiredError']
        }
      ];
      testCases.forEach(testCase => {
        expect(checkFormErrors(
          testCase.imageTooBig,
          testCase.commentText,
          testCase.section,
          testCase.answers,
          testCase.userAnsweredAllQuestions,
          testCase.isReply)).toEqual(testCase.expectedResult);
      });
    });
  });

  describe('hasAnyAnswers', () => {
    test('returns true when answers object array contains answered answers', () => {
      expect(hasAnyAnswers(answersAnswered)).toBe(true);
    });

    test('returns false when answers object array does not contain answered answers', () => {
      expect(hasAnyAnswers(answersNone)).toBe(false);
    });
  });

  describe('hasAnyQuestions', () => {
    test('returns true when section contains questions', () => {
      expect(hasAnyQuestions(sectionWithQuestions)).toBe(true);
    });

    test('returns false when section does not contain questions', () => {
      expect(hasAnyQuestions(sectionEmpty)).toBe(false);
    });
  });

  describe('isCommentRequired', () => {
    describe('returns true', () => {
      test('when comment is a reply', () => {
        expect(isCommentRequired(false, true, false)).toBe(true);
      });

      test('when comment is not a reply and section does not have questions', () => {
        expect(isCommentRequired(false, false, false)).toBe(true);
      });
      test('when comment is not a reply and section has questions and user answered all questions', () => {
        expect(isCommentRequired(true, false, true)).toBe(true);
      });
    });

    test('returns false when comment is not a reply and section has questions', () => {
      expect(isCommentRequired(true, false, false)).toBe(false);
    });
  });

  describe('isEmptyCommentAllowed', () => {
    test('returns false when section does not have questions', () => {
      expect(isEmptyCommentAllowed(sectionEmpty, false));
    });

    test('returns false when section has questions but none are answered', () => {
      expect(isEmptyCommentAllowed(sectionWithQuestions, false));
    });

    test('returns true when section has questions and some are answered', () => {
      expect(isEmptyCommentAllowed(sectionWithQuestions, true));
    });
  });

  describe('hasUserAnsweredQuestions', () => {
    test('returns false when user is falsy', () => {
      expect(hasUserAnsweredQuestions(undefined)).toBe(false);
    });

    test('returns false when user has not answered any questions', () => {
      const userNoAnswers = createUser();
      expect(hasUserAnsweredQuestions(userNoAnswers)).toBe(false);
    });

    test('returns true when user has answered some questions', () => {
      const userWithAnswers = createUser({answered_questions: [1, 2]});
      expect(hasUserAnsweredQuestions(userWithAnswers)).toBe(true);
    });
  });

  describe('hasUserAnsweredAllQuestions', () => {
    const userOneAnswer = createUser({answered_questions: [1]});
    const userAllAnswers = createUser({answered_questions: [1, 2]});

    describe('returns false', () => {
      test('when section has no questions', () => {
        expect(hasUserAnsweredAllQuestions(userOneAnswer, sectionEmpty)).toBe(false);
      });
      test('when section has questions and user has not answered any question', () => {
        expect(hasUserAnsweredAllQuestions(createUser(), sectionWithQuestions)).toBe(false);
      });
      test('when user has not answered all questions', () => {
        expect(hasUserAnsweredAllQuestions(userOneAnswer, sectionWithQuestions)).toBe(false);
      });
    });
    test('returns true when user has answered all questions', () => {
      expect(hasUserAnsweredAllQuestions(userAllAnswers, sectionWithQuestions)).toBe(true);
    });
  });

  describe('getFirstUnansweredQuestion', () => {
    describe('returns null', () => {
      test('when section has no questions', () => {
        expect(getFirstUnansweredQuestion(createUser(), sectionEmpty)).toBe(null);
      });

      test('when section has no unanswered questions', () => {
        const userWithAnswers = createUser({answered_questions: [1, 2]});
        expect(getFirstUnansweredQuestion(userWithAnswers, sectionWithQuestions)).toBe(null);
      });
    });

    describe('returns first unanswered question', () => {
      test('when user is anon', () => {
        expect(getFirstUnansweredQuestion(null, sectionWithQuestions))
          .toBe(sectionWithQuestions.questions[0]);
      });

      test('when signed in user has not answered any questions', () => {
        expect(getFirstUnansweredQuestion(createUser(), sectionWithQuestions))
          .toBe(sectionWithQuestions.questions[0]);
      });

      test('when signed in user has answered some questions', () => {
        expect(getFirstUnansweredQuestion(createUser({answered_questions: [1]}), sectionWithQuestions))
          .toBe(sectionWithQuestions.questions[1]);
        expect(getFirstUnansweredQuestion(createUser({answered_questions: [2]}), sectionWithQuestions))
          .toBe(sectionWithQuestions.questions[0]);
      });
    });
  });
});
