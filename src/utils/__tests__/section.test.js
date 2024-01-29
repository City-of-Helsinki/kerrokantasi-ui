import {
  initNewSection,
  getSectionCommentingErrorMessage,
  getSectionCommentingMessage,
  isSectionCommentingMapEnabled,
  checkFormErrors,
  getFirstUnansweredQuestion,
  hasAnyAnswers,
  hasAnyQuestions,
  hasUserAnsweredAllQuestions,
  hasUserAnsweredQuestions,
  isCommentRequired,
  isEmptyCommentAllowed
} from '../section';

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
const sectionWithQuestions = initNewSection({ questions: [{ id: 1 }, { id: 2 }] });
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

  return { ...user, ...initialValues };
}

describe('section', () => {
  it('should init section with values', () => {
    const section = initNewSection({ id: "test-id" });
    expect(section.id).toBe("test-id");
  });

  describe('getSectionCommentingMessage ', () => {
    it('should return "openCommenting" when commenting is open', () => {
      const section = initNewSection({ commenting: 'open' });
      const value = getSectionCommentingMessage(section);
      expect(value).toBe('openCommenting');
    });

    it('should return "commentRegisteredUsersOnly" when commenting is registered', () => {
      const section = initNewSection({ commenting: 'registered' });
      const value = getSectionCommentingMessage(section);
      expect(value).toBe('commentRegisteredUsersOnly');
    });

    it('should return "commentStrongRegisteredUsersOnly" when commenting is strong', () => {
      const section = initNewSection({ commenting: 'strong' });
      const value = getSectionCommentingMessage(section);
      expect(value).toBe('commentStrongRegisteredUsersOnly');
    });

    it('should return "noCommenting" when commenting is none', () => {
      const section = initNewSection({ commenting: 'none' });
      const value = getSectionCommentingMessage(section);
      expect(value).toBe('noCommenting');
    });

    it('should return "openCommenting" as default', () => {
      const section = initNewSection({ commenting: 'somethingThatShouldntHappen' });
      const value = getSectionCommentingMessage(section);
      expect(value).toBe('openCommenting');
    });
  });

  describe('getSectionCommentingErrorMessage ', () => {
    it('should return "commentStrongRegisteredUsersOnly" when commenting is strong', () => {
      const section = initNewSection({ commenting: 'strong' });
      const value = getSectionCommentingErrorMessage(section);
      expect(value).toBe('commentStrongRegisteredUsersOnly');
    });

    it('should return "loginToComment" when commenting something other than strong', () => {
      const section = initNewSection({ commenting: 'registered' });
      const value = getSectionCommentingErrorMessage(section);
      expect(value).toBe('loginToComment');
    });
  });

  describe('isSectionCommentingMapEnabled', () => {
    describe('when user is null(not logged in)', () => {
      const nullUser = null;

      it('should return false when open commenting and commenting_map_tools is none', () => {
        const section = initNewSection({ commenting_map_tools: 'none' });
        expect(isSectionCommentingMapEnabled(nullUser, section)).toBe(false);
      });

      it('should return true when open commenting and commenting_map_tools is marker or all', () => {
        const sectionMarker = initNewSection({ commenting_map_tools: 'marker' });
        expect(isSectionCommentingMapEnabled(nullUser, sectionMarker)).toBe(true);
        const sectionAll = initNewSection({ commenting_map_tools: 'all' });
        expect(isSectionCommentingMapEnabled(nullUser, sectionAll)).toBe(true);
      });

      it('should return false when section commenting is something other than open', () => {
        const sectionNone = initNewSection({ commenting: 'none', commenting_map_tools: 'all' });
        const sectionRegistered = initNewSection({ commenting: 'registered', commenting_map_tools: 'all' });
        const sectionStrong = initNewSection({ commenting: 'strong', commenting_map_tools: 'all' });
        expect(isSectionCommentingMapEnabled(nullUser, sectionNone)).toBe(false);
        expect(isSectionCommentingMapEnabled(nullUser, sectionRegistered)).toBe(false);
        expect(isSectionCommentingMapEnabled(nullUser, sectionStrong)).toBe(false);
      });
    });

    describe('when user is logged in(not admin or strong)', () => {
      const user = { displayName: 'Tim Test' };

      it('should return false when open commenting and commenting_map_tools is none', () => {
        const section = initNewSection({ commenting_map_tools: 'none' });
        expect(isSectionCommentingMapEnabled(user, section)).toBe(false);
      });

      it('should return true when open commenting and commenting_map_tools is marker or all', () => {
        const sectionMarker = initNewSection({ commenting_map_tools: 'marker' });
        expect(isSectionCommentingMapEnabled(user, sectionMarker)).toBe(true);
        const sectionAll = initNewSection({ commenting_map_tools: 'all' });
        expect(isSectionCommentingMapEnabled(user, sectionAll)).toBe(true);
      });

      it('should return true when registered commenting and commenting_map_tools is marker or all', () => {
        const sectionMarker = initNewSection({ commenting: 'registered', commenting_map_tools: 'marker' });
        expect(isSectionCommentingMapEnabled(user, sectionMarker)).toBe(true);
        const sectionAll = initNewSection({ commenting: 'registered', commenting_map_tools: 'all' });
        expect(isSectionCommentingMapEnabled(user, sectionAll)).toBe(true);
      });

      it('should return false when strong commenting and commenting_map_tools is marker or all', () => {
        const sectionMarker = initNewSection({ commenting: 'strong', commenting_map_tools: 'marker' });
        expect(isSectionCommentingMapEnabled(user, sectionMarker)).toBe(false);
        const sectionAll = initNewSection({ commenting: 'strong', commenting_map_tools: 'all' });
        expect(isSectionCommentingMapEnabled(user, sectionAll)).toBe(false);
      });
    });

    describe('when user is logged in with strong authentication', () => {
      const strongUser = { displayName: 'Strong User', hasStrongAuth: true };

      it('should return false when commenting is open/registered/strong and commenting_map_tools is none', () => {
        const sectionOpen = initNewSection({ commenting: 'open', commenting_map_tools: 'none' });
        const sectionRegistered = initNewSection({ commenting: 'registered', commenting_map_tools: 'none' });
        const sectionStrong = initNewSection({ commenting: 'strong', commenting_map_tools: 'none' });
        expect(isSectionCommentingMapEnabled(strongUser, sectionOpen)).toBe(false);
        expect(isSectionCommentingMapEnabled(strongUser, sectionRegistered)).toBe(false);
        expect(isSectionCommentingMapEnabled(strongUser, sectionStrong)).toBe(false);
      });

      it('should return true when commenting is open/registered/strong and commenting_map_tools is marker/all', () => {
        const sectionOpen = initNewSection({ commenting: 'open', commenting_map_tools: 'marker' });
        const sectionRegistered = initNewSection({ commenting: 'registered', commenting_map_tools: 'all' });
        const sectionStrong = initNewSection({ commenting: 'strong', commenting_map_tools: 'all' });
        expect(isSectionCommentingMapEnabled(strongUser, sectionOpen)).toBe(true);
        expect(isSectionCommentingMapEnabled(strongUser, sectionRegistered)).toBe(true);
        expect(isSectionCommentingMapEnabled(strongUser, sectionStrong)).toBe(true);
      });
    });
  });

  describe('section util tests', () => {
    describe('checkFormErrors', () => {
      it('returns correct error array with given params', () => {
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
      it('returns true when answers object array contains answered answers', () => {
        expect(hasAnyAnswers(answersAnswered)).toBe(true);
      });

      it('returns false when answers object array does not contain answered answers', () => {
        expect(hasAnyAnswers(answersNone)).toBe(false);
      });
    });

    describe('hasAnyQuestions', () => {
      it('returns true when section contains questions', () => {
        expect(hasAnyQuestions(sectionWithQuestions)).toBe(true);
      });

      it('returns false when section does not contain questions', () => {
        expect(hasAnyQuestions(sectionEmpty)).toBe(false);
      });
    });

    describe('isCommentRequired', () => {
      it('returns true when comment is a reply', () => {
        expect(isCommentRequired(false, true, false)).toBe(true);
      });

      it('returns true when comment is not a reply and section does not have questions', () => {
        expect(isCommentRequired(false, false, false)).toBe(true);
      });

      it('returns true when comment is not a reply and section has questions and user answered all questions', () => {
        expect(isCommentRequired(true, false, true)).toBe(true);
      });

      it('returns false when comment is not a reply and section has questions', () => {
        expect(isCommentRequired(true, false, false)).toBe(false);
      });
    });

    describe('isEmptyCommentAllowed', () => {
      it('returns false when section does not have questions', () => {
        expect(isEmptyCommentAllowed(sectionEmpty, false));
      });

      it('returns false when section has questions but none are answered', () => {
        expect(isEmptyCommentAllowed(sectionWithQuestions, false));
      });

      it('returns true when section has questions and some are answered', () => {
        expect(isEmptyCommentAllowed(sectionWithQuestions, true));
      });
    });

    describe('hasUserAnsweredQuestions', () => {
      it('returns false when user is falsy', () => {
        expect(hasUserAnsweredQuestions(undefined)).toBe(false);
      });

      it('returns false when user has not answered any questions', () => {
        const userNoAnswers = createUser();
        expect(hasUserAnsweredQuestions(userNoAnswers)).toBe(false);
      });

      it('returns true when user has answered some questions', () => {
        const userWithAnswers = createUser({ answered_questions: [1, 2] });
        expect(hasUserAnsweredQuestions(userWithAnswers)).toBe(true);
      });
    });

    describe('hasUserAnsweredAllQuestions', () => {
      const userOneAnswer = createUser({ answered_questions: [1] });
      const userAllAnswers = createUser({ answered_questions: [1, 2] });

      it('returns false when section has no questions', () => {
        expect(hasUserAnsweredAllQuestions(userOneAnswer, sectionEmpty)).toBe(false);
      });

      it('returns false when section has questions and user has not answered any question', () => {
        expect(hasUserAnsweredAllQuestions(createUser(), sectionWithQuestions)).toBe(false);
      });

      it('returns false when user has not answered all questions', () => {
        expect(hasUserAnsweredAllQuestions(userOneAnswer, sectionWithQuestions)).toBe(false);
      });

      it('returns true when user has answered all questions', () => {
        expect(hasUserAnsweredAllQuestions(userAllAnswers, sectionWithQuestions)).toBe(true);
      });
    });

    describe('getFirstUnansweredQuestion', () => {
      it('returns null when section has no questions', () => {
        expect(getFirstUnansweredQuestion(createUser(), sectionEmpty)).toBe(null);
      });

      it('returns null when section has no unanswered questions', () => {
        const userWithAnswers = createUser({ answered_questions: [1, 2] });
        expect(getFirstUnansweredQuestion(userWithAnswers, sectionWithQuestions)).toBe(null);
      });

      it('returns first unanswered question when user is anon', () => {
        expect(getFirstUnansweredQuestion(null, sectionWithQuestions))
          .toBe(sectionWithQuestions.questions[0]);
      });

      it('returns first unanswered question when signed in user has not answered any questions', () => {
        expect(getFirstUnansweredQuestion(createUser(), sectionWithQuestions))
          .toBe(sectionWithQuestions.questions[0]);
      });

      it('returns first unanswered question when signed in user has answered some questions', () => {
        expect(getFirstUnansweredQuestion(createUser({ answered_questions: [1] }), sectionWithQuestions))
          .toBe(sectionWithQuestions.questions[1]);
        expect(getFirstUnansweredQuestion(createUser({ answered_questions: [2] }), sectionWithQuestions))
          .toBe(sectionWithQuestions.questions[0]);
      });

    });
  });
});
