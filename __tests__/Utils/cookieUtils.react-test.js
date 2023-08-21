import { getCookieScripts, } from '../../src/utils/cookieUtils';
// eslint-disable-next-line import/no-unresolved
import { getCookieBotScripts } from '../../src/utils/cookiebotUtils';
import config from '../../src/config';

const mockIsCookiebotEnabled = jest.fn();
jest.mock('../../src/utils/cookiebotUtils', () => {
  const originalModule = jest.requireActual('../../src/utils/cookiebotUtils');
  return {
    __esModule: true,
    ...originalModule,
    isCookiebotEnabled: mockIsCookiebotEnabled,
    default: {
      ...originalModule.default,
      isCookiebotEnabled: () => mockIsCookiebotEnabled(),
    }
  };
});

jest.mock('../../src/config', () => ({
  enableCookies: true
}));

describe('cookieUtils', () => {
  describe('getCookieScripts', () => {
    describe('when isCookiebotEnabled returns true', () => {
      mockIsCookiebotEnabled.mockReturnValueOnce(true);

      afterEach(() => {
        jest.clearAllMocks();
      });

      test('returns cookiebotUtils getCookieScripts', () => {
        expect(getCookieScripts()).toEqual(getCookieBotScripts());
      });
    });

    describe('when isCookiebotEnabled returns false', () => {
      mockIsCookiebotEnabled.mockReturnValue(false);
      afterEach(() => {
        jest.clearAllMocks();
      });

      test('when cookies are enabled, calls addCookieScripts', () => {
        config.enableCookies = true;
        expect(getCookieScripts()).toEqual(true);
      });

      test('when cookies are not enabled, returns null', () => {
        config.enableCookies = false;
        expect(getCookieScripts()).toBe(null);
      });
    });
  });
});
