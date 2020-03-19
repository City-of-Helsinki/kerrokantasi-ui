import {
  initNewSection,
  getSectionCommentingErrorMessage,
  getSectionCommentingMessage
} from '../src/utils/section';


test('New section initializer accepts initial values', () => {
  const section = initNewSection({id: "test-id"});
  expect(section.id).toBe("test-id");
});

describe('sectionUtils', () => {
  describe('getSectionCommentingMessage ', () => {
    test('returns "openCommenting" when commenting is open', () => {
      const section = initNewSection({commenting: 'open'});
      const value = getSectionCommentingMessage(section);
      expect(value).toBe('openCommenting');
    });
    test('returns "commentRegisteredUsersOnly" when commenting is registered', () => {
      const section = initNewSection({commenting: 'registered'});
      const value = getSectionCommentingMessage(section);
      expect(value).toBe('commentRegisteredUsersOnly');
    });
    test('returns "commentStrongRegisteredUsersOnly" when commenting is strong', () => {
      const section = initNewSection({commenting: 'strong'});
      const value = getSectionCommentingMessage(section);
      expect(value).toBe('commentStrongRegisteredUsersOnly');
    });
    test('returns "noCommenting" when commenting is none', () => {
      const section = initNewSection({commenting: 'none'});
      const value = getSectionCommentingMessage(section);
      expect(value).toBe('noCommenting');
    });
    test('returns "openCommenting" as default', () => {
      const section = initNewSection({commenting: 'somethingThatShouldntHappen'});
      const value = getSectionCommentingMessage(section);
      expect(value).toBe('openCommenting');
    });
  });
  describe('getSectionCommentingErrorMessage ', () => {
    test('returns "commentStrongRegisteredUsersOnly" when commenting is strong', () => {
      const section = initNewSection({commenting: 'strong'});
      const value = getSectionCommentingErrorMessage(section);
      expect(value).toBe('commentStrongRegisteredUsersOnly');
    });
    test('returns "loginToComment" when commenting something other than strong', () => {
      const section = initNewSection({commenting: 'registered'});
      const value = getSectionCommentingErrorMessage(section);
      expect(value).toBe('loginToComment');
    });
  });
});
