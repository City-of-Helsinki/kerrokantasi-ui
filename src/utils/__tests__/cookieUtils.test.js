vi.mock('@city-assets/urls.json', () => ({
  default: {}
}));

import { getLegacyAnalyticsScript } from '../cookieUtils.jsx';

describe('cookieUtils', () => {
  describe('getLegacyAnalyticsScript', () => {
    it('returns null when urls.analytics is not configured', () => {
      expect(getLegacyAnalyticsScript()).toBeNull();
    });
  });
});
