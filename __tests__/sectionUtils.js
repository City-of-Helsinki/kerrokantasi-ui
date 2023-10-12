import {
  initNewSection,
  getSectionCommentingErrorMessage,
  getSectionCommentingMessage,
  isSectionCommentingMapEnabled
} from '../src/utils/section';


test('New section initializer accepts initial values', () => {
  const section = initNewSection({ id: "test-id" });
  expect(section.id).toBe("test-id");
});

describe('sectionUtils', () => {
  describe('getSectionCommentingMessage ', () => {
    test('returns "openCommenting" when commenting is open', () => {
      const section = initNewSection({ commenting: 'open' });
      const value = getSectionCommentingMessage(section);
      expect(value).toBe('openCommenting');
    });
    test('returns "commentRegisteredUsersOnly" when commenting is registered', () => {
      const section = initNewSection({ commenting: 'registered' });
      const value = getSectionCommentingMessage(section);
      expect(value).toBe('commentRegisteredUsersOnly');
    });
    test('returns "commentStrongRegisteredUsersOnly" when commenting is strong', () => {
      const section = initNewSection({ commenting: 'strong' });
      const value = getSectionCommentingMessage(section);
      expect(value).toBe('commentStrongRegisteredUsersOnly');
    });
    test('returns "noCommenting" when commenting is none', () => {
      const section = initNewSection({ commenting: 'none' });
      const value = getSectionCommentingMessage(section);
      expect(value).toBe('noCommenting');
    });
    test('returns "openCommenting" as default', () => {
      const section = initNewSection({ commenting: 'somethingThatShouldntHappen' });
      const value = getSectionCommentingMessage(section);
      expect(value).toBe('openCommenting');
    });
  });
  describe('getSectionCommentingErrorMessage ', () => {
    test('returns "commentStrongRegisteredUsersOnly" when commenting is strong', () => {
      const section = initNewSection({ commenting: 'strong' });
      const value = getSectionCommentingErrorMessage(section);
      expect(value).toBe('commentStrongRegisteredUsersOnly');
    });
    test('returns "loginToComment" when commenting something other than strong', () => {
      const section = initNewSection({ commenting: 'registered' });
      const value = getSectionCommentingErrorMessage(section);
      expect(value).toBe('loginToComment');
    });
  });
  describe('isSectionCommentingMapEnabled', () => {
    describe('when user is null(not logged in)', () => {
      const nullUser = null;
      test('returns false when open commenting and commenting_map_tools is none', () => {
        const section = initNewSection({ commenting_map_tools: 'none' });
        expect(isSectionCommentingMapEnabled(nullUser, section)).toBe(false);
      });
      test('returns true when open commenting and commenting_map_tools is marker or all', () => {
        const sectionMarker = initNewSection({ commenting_map_tools: 'marker' });
        expect(isSectionCommentingMapEnabled(nullUser, sectionMarker)).toBe(true);
        const sectionAll = initNewSection({ commenting_map_tools: 'all' });
        expect(isSectionCommentingMapEnabled(nullUser, sectionAll)).toBe(true);
      });
      test('returns false when section commenting is something other than open', () => {
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
      test('returns false when open commenting and commenting_map_tools is none', () => {
        const section = initNewSection({ commenting_map_tools: 'none' });
        expect(isSectionCommentingMapEnabled(user, section)).toBe(false);
      });
      test('returns true when open commenting and commenting_map_tools is marker or all', () => {
        const sectionMarker = initNewSection({ commenting_map_tools: 'marker' });
        expect(isSectionCommentingMapEnabled(user, sectionMarker)).toBe(true);
        const sectionAll = initNewSection({ commenting_map_tools: 'all' });
        expect(isSectionCommentingMapEnabled(user, sectionAll)).toBe(true);
      });
      test('returns true when registered commenting and commenting_map_tools is marker or all', () => {
        const sectionMarker = initNewSection({ commenting: 'registered', commenting_map_tools: 'marker' });
        expect(isSectionCommentingMapEnabled(user, sectionMarker)).toBe(true);
        const sectionAll = initNewSection({ commenting: 'registered', commenting_map_tools: 'all' });
        expect(isSectionCommentingMapEnabled(user, sectionAll)).toBe(true);
      });
      test('returns false when strong commenting and commenting_map_tools is marker or all', () => {
        const sectionMarker = initNewSection({ commenting: 'strong', commenting_map_tools: 'marker' });
        expect(isSectionCommentingMapEnabled(user, sectionMarker)).toBe(false);
        const sectionAll = initNewSection({ commenting: 'strong', commenting_map_tools: 'all' });
        expect(isSectionCommentingMapEnabled(user, sectionAll)).toBe(false);
      });
    });
    describe('when user is logged in with strong authentication', () => {
      const strongUser = { displayName: 'Strong User', hasStrongAuth: true };
      test('returns false when commenting is open/registered/strong and commenting_map_tools is none', () => {
        const sectionOpen = initNewSection({ commenting: 'open', commenting_map_tools: 'none' });
        const sectionRegistered = initNewSection({ commenting: 'registered', commenting_map_tools: 'none' });
        const sectionStrong = initNewSection({ commenting: 'strong', commenting_map_tools: 'none' });
        expect(isSectionCommentingMapEnabled(strongUser, sectionOpen)).toBe(false);
        expect(isSectionCommentingMapEnabled(strongUser, sectionRegistered)).toBe(false);
        expect(isSectionCommentingMapEnabled(strongUser, sectionStrong)).toBe(false);
      });
      test('returns true when commenting is open/registered/strong and commenting_map_tools is marker/all', () => {
        const sectionOpen = initNewSection({ commenting: 'open', commenting_map_tools: 'marker' });
        const sectionRegistered = initNewSection({ commenting: 'registered', commenting_map_tools: 'all' });
        const sectionStrong = initNewSection({ commenting: 'strong', commenting_map_tools: 'all' });
        expect(isSectionCommentingMapEnabled(strongUser, sectionOpen)).toBe(true);
        expect(isSectionCommentingMapEnabled(strongUser, sectionRegistered)).toBe(true);
        expect(isSectionCommentingMapEnabled(strongUser, sectionStrong)).toBe(true);
      });
    });
  });
});
