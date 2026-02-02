/* eslint-disable no-underscore-dangle */
import React from 'react';
import { render } from '@testing-library/react';

import {
  cookieBotAddListeners,
  cookieBotRemoveListeners,
  cookieBotImageOverride,
  cookieBotOnAccept,
  cookieBotOnDecline,
  getCookieBotScripts,
  getCookiebotConsent,
  isCookiebotEnabled,
  resetCookiebotState,
} from '../cookiebotUtils';
import config from '../../config';

vi.mock('../../config', () => ({
  default: {
    enableCookies: true,
    enableCookiebot: true,
    cookiebotDataCbid: '123-abc',
  },
}));

describe('cookiebotUtils', () => {
  beforeEach(() => {
    // Reset window.Cookiebot before each test
    delete window.Cookiebot;
    delete window._paq;
    delete window.location;
    window.location = { reload: vi.fn() };
    // Reset module state
    resetCookiebotState();
  });

  describe('cookieBotAddListeners', () => {
    afterEach(() => {
      vi.clearAllMocks();
      config.enableCookies = true;
      config.enableCookiebot = true;
    });
    it('calls window.addEventListener with correct params if enableCookies and enableCookiebot is true', () => {
      window.addEventListener = vi.fn();
      cookieBotAddListeners();
      expect(window.addEventListener).toHaveBeenCalledWith('CookiebotOnDialogDisplay', cookieBotImageOverride);
    });
    it('does not call window.addEventListener when enableCookies is false', () => {
      config.enableCookies = false;
      window.addEventListener = vi.fn();
      cookieBotAddListeners();
      expect(window.addEventListener).not.toHaveBeenCalled();
    });
    it('does not call window.addEventListener when enableCookiebot is false', () => {
      config.enableCookiebot = false;
      window.addEventListener = vi.fn();
      cookieBotAddListeners();
      expect(window.addEventListener).not.toHaveBeenCalled();
    });
  });

  describe('cookieBotRemoveListeners', () => {
    afterEach(() => {
      vi.clearAllMocks();
      config.enableCookies = true;
    });
    it('calls window.removeEventListener with correct params if enableCookies and enableCookiebot is true', () => {
      window.removeEventListener = vi.fn();
      cookieBotRemoveListeners();
      expect(window.removeEventListener).toHaveBeenCalledWith('CookiebotOnDialogDisplay', cookieBotImageOverride);
    });
    it('does not call window.removeEventListener when enableCookies is false', () => {
      config.enableCookies = false;
      window.removeEventListener = vi.fn();
      cookieBotRemoveListeners();
      expect(window.removeEventListener).not.toHaveBeenCalled();
    });
    it('does not call window.removeEventListener when enableCookiebot is false', () => {
      config.enableCookiebot = false;
      window.removeEventListener = vi.fn();
      cookieBotRemoveListeners();
      expect(window.removeEventListener).not.toHaveBeenCalled();
    });
  });

  describe('getCookieScripts', () => {
    it('returns a script element', () => {
      const element = getCookieBotScripts();

      render(<div>{element}</div>);
    });
  });

  describe('isCookiebotEnabled', () => {
    afterEach(() => {
      vi.clearAllMocks();
    });

    it('returns true when both cookies and Cookiebot are enabled', () => {
      config.enableCookies = true;
      config.enableCookiebot = true;
      expect(isCookiebotEnabled()).toBe(true);
    });

    it('returns false when cookies are not enabled', () => {
      config.enableCookies = false;
      config.enableCookiebot = true;
      expect(isCookiebotEnabled()).toBe(false);
    });

    it('returns false when Cookiebot is not enabled', () => {
      config.enableCookies = true;
      config.enableCookiebot = false;
      expect(isCookiebotEnabled()).toBe(false);
    });
  });

  describe('getCookiebotConsent', () => {
    beforeEach(() => {
      config.enableCookies = true;
      config.enableCookiebot = true;
    });

    it('returns false when Cookiebot is not enabled', () => {
      config.enableCookies = false;
      expect(getCookiebotConsent('marketing')).toBe(false);
    });

    it('returns false when window.Cookiebot is not available', () => {
      delete window.Cookiebot;
      expect(getCookiebotConsent('statistics')).toBe(false);
    });

    it('returns false when window.Cookiebot.consent is not available', () => {
      window.Cookiebot = {};
      expect(getCookiebotConsent('preferences')).toBe(false);
    });

    it('returns the correct consent value when available', () => {
      window.Cookiebot = {
        consent: {
          marketing: true,
          statistics: false,
          preferences: true,
        },
      };
      expect(getCookiebotConsent('marketing')).toBe(true);
      expect(getCookiebotConsent('statistics')).toBe(false);
      expect(getCookiebotConsent('preferences')).toBe(true);
    });

    it('returns false for undefined consent groups', () => {
      window.Cookiebot = {
        consent: {
          marketing: true,
        },
      };
      expect(getCookiebotConsent('nonexistent')).toBe(false);
    });
  });

  describe('cookieBotImageOverride', () => {
    it('sets the img src to empty string', () => {
      const mockElement = { src: 'https://example.com/image.png' };
      document.getElementById = vi.fn(() => mockElement);

      cookieBotImageOverride();

      expect(mockElement.src).toBe('');
      expect(document.getElementById).toHaveBeenCalledWith('CybotCookiebotDialogPoweredbyImage');
    });
  });

  describe('cookieBotOnAccept', () => {
    it('returns early when window.Cookiebot is not available', () => {
      delete window.Cookiebot;
      window._paq = [];

      cookieBotOnAccept();

      expect(window._paq).toEqual([]);
    });

    it('enables Matomo tracking when statistics consent is given', () => {
      window._paq = [];
      window.Cookiebot = {
        consent: { statistics: true, preferences: false, marketing: false },
        hasResponse: false,
      };

      cookieBotOnAccept();

      expect(window._paq).toContainEqual(['setConsentGiven']);
      expect(window._paq).toContainEqual(['setCookieConsentGiven']);
    });

    it('does not enable Matomo when statistics consent is not given', () => {
      window._paq = [];
      window.Cookiebot = {
        consent: { statistics: false, preferences: false, marketing: false },
        hasResponse: false,
      };

      cookieBotOnAccept();

      expect(window._paq).toEqual([]);
    });

    it('reloads page on first accept when preferences is enabled', () => {
      window.Cookiebot = {
        consent: { statistics: false, preferences: true, marketing: false },
        hasResponse: true,
      };

      cookieBotOnAccept();

      expect(window.location.reload).toHaveBeenCalled();
    });

    it('reloads page on first accept when marketing is enabled', () => {
      window.Cookiebot = {
        consent: { statistics: false, preferences: false, marketing: true },
        hasResponse: true,
      };

      cookieBotOnAccept();

      expect(window.location.reload).toHaveBeenCalled();
    });

    it('does not reload on first accept when neither preferences nor marketing is enabled', () => {
      window.Cookiebot = {
        consent: { statistics: true, preferences: false, marketing: false },
        hasResponse: true,
      };

      cookieBotOnAccept();

      expect(window.location.reload).not.toHaveBeenCalled();
    });

    it('reloads page when preferences consent changes', () => {
      // First call - set initial state
      window.Cookiebot = {
        consent: { statistics: false, preferences: false, marketing: false },
        hasResponse: false,
      };
      cookieBotOnAccept();
      expect(window.location.reload).not.toHaveBeenCalled();

      // Second call - change preferences
      window.Cookiebot = {
        consent: { statistics: false, preferences: true, marketing: false },
        hasResponse: true,
      };
      cookieBotOnAccept();

      expect(window.location.reload).toHaveBeenCalled();
    });

    it('reloads page when marketing consent changes', () => {
      // First call - set initial state
      window.Cookiebot = {
        consent: { statistics: false, preferences: false, marketing: false },
        hasResponse: false,
      };
      cookieBotOnAccept();
      expect(window.location.reload).not.toHaveBeenCalled();

      // Second call - change marketing
      window.Cookiebot = {
        consent: { statistics: false, preferences: false, marketing: true },
        hasResponse: true,
      };
      cookieBotOnAccept();

      expect(window.location.reload).toHaveBeenCalled();
    });

    it('does not reload when consent stays the same', () => {
      // First call - set initial state
      window.Cookiebot = {
        consent: { statistics: false, preferences: true, marketing: true },
        hasResponse: true,
      };
      cookieBotOnAccept();
      expect(window.location.reload).toHaveBeenCalledTimes(1);

      // Reset reload mock
      window.location.reload.mockClear();

      // Second call - same consent
      window.Cookiebot = {
        consent: { statistics: false, preferences: true, marketing: true },
        hasResponse: true,
      };
      cookieBotOnAccept();

      expect(window.location.reload).not.toHaveBeenCalled();
    });

    it('does not reload when hasResponse is false even if consent changed', () => {
      // First call - set initial state
      window.Cookiebot = {
        consent: { statistics: false, preferences: false, marketing: false },
        hasResponse: false,
      };
      cookieBotOnAccept();

      // Second call - change consent but hasResponse is false (page load)
      window.Cookiebot = {
        consent: { statistics: false, preferences: true, marketing: false },
        hasResponse: false,
      };
      cookieBotOnAccept();

      expect(window.location.reload).not.toHaveBeenCalled();
    });
  });

  describe('cookieBotOnDecline', () => {
    it('removes Matomo consent when _paq is available', () => {
      window._paq = [];

      cookieBotOnDecline();

      expect(window._paq).toContainEqual(['forgetConsentGiven']);
    });

    it('does nothing when _paq is not available', () => {
      delete window._paq;

      expect(() => cookieBotOnDecline()).not.toThrow();
    });
  });
});
