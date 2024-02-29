import { getCookieScripts } from '../cookieUtils';
import { getCookieBotScripts } from '../cookiebotUtils';
import config from '../../config';

const mockIsCookiebotEnabled = jest.fn();

jest.mock('../cookiebotUtils', () => {
  const originalModule = jest.requireActual('../cookiebotUtils');

  return {
    __esModule: true,
    ...originalModule,
    isCookiebotEnabled: () => mockIsCookiebotEnabled(),
  };
});


jest.mock('../../config', () => ({
  enableCookies: true
}));

describe('cookieUtils', () => {
  describe('getCookieScripts', () => {
    describe('when isCookiebotEnabled returns true', () => {
      mockIsCookiebotEnabled.mockReturnValueOnce(true);

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('returns cookiebotUtils getCookieScripts', () => {
        expect(getCookieScripts()).toEqual(getCookieBotScripts());
      });
    });

    describe('when isCookiebotEnabled', () => {
      mockIsCookiebotEnabled.mockReturnValue(false);
      afterEach(() => {
        jest.clearAllMocks();
      });

      it('returns false when cookies are enabled, calls addCookieScripts', () => {
        config.enableCookies = true;
        expect(getCookieScripts()).toEqual(true);
      });

      it('returns null when cookies are not enabled', () => {
        config.enableCookies = false;
        expect(getCookieScripts()).toBe(null);
      });
    });
  });
});
