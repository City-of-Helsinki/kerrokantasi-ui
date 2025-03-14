import { getCookieScripts } from '../cookieUtils';
import { getCookieBotScripts } from '../cookiebotUtils';
// eslint-disable-next-line no-unused-vars
import config from '../../config';

const mockIsCookiebotEnabled = vi.fn();

vi.mock('../cookiebotUtils', async () => {
  const mod = await vi.importActual('../cookiebotUtils');

  return {
    ...mod,
    __esModule: true,
    isCookiebotEnabled: () => mockIsCookiebotEnabled(),
  };
});


vi.mock('../../config', () => ({
  default: () => ({
    enableCookies: true
  })
}));

describe('cookieUtils', () => {
  describe('getCookieScripts', () => {
    describe('when isCookiebotEnabled returns true', () => {
      mockIsCookiebotEnabled.mockReturnValueOnce(true);

      afterEach(() => {
        vi.clearAllMocks();
      });

      it('returns cookiebotUtils getCookieScripts', () => {
        expect(getCookieScripts()).toEqual(getCookieBotScripts());
      });
    });

    describe('when isCookiebotEnabled', () => {
      mockIsCookiebotEnabled.mockReturnValue(false);
      afterEach(() => {
        vi.clearAllMocks();
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
