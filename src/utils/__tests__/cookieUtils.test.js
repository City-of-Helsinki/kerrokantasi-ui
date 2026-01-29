import { getCookieScripts } from '../cookieUtils';
import { getCookieBotScripts } from '../cookiebotUtils';

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
  });
});
