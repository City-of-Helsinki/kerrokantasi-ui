/* eslint-disable import/no-unresolved */
import React from 'react';
import { render } from '@testing-library/react';

import {
  cookieBotAddListener,
  cookieBotRemoveListener,
  cookieBotImageOverride,
  getCookieBotConsentScripts,
  getCookieBotScripts,
  isCookiebotEnabled,
} from '../cookiebotUtils';
import config from '../../config';


jest.mock('../../config', () => ({
  enableCookies: true,
  enableCookiebot: true,
  cookiebotDataCbid: '123-abc'
}));

describe('cookiebotUtils', () => {
  describe('cookieBotAddListener', () => {
    afterEach(() => {
      jest.clearAllMocks();
      config.enableCookies = true;
      config.enableCookiebot = true;
    });
    it('calls window.addEventListener with correct params if enableCookies and enableCookiebot is true', () => {
      window.addEventListener = jest.fn();
      cookieBotAddListener();
      expect(window.addEventListener).toHaveBeenCalledWith('CookiebotOnDialogDisplay', cookieBotImageOverride);
    });
    it('does not call window.addEventListener when enableCookies is false', () => {
      config.enableCookies = false;
      window.addEventListener = jest.fn();
      cookieBotAddListener();
      expect(window.addEventListener).not.toHaveBeenCalled();
    });
    it('does not call window.addEventListener when enableCookiebot is false', () => {
      config.enableCookiebot = false;
      window.addEventListener = jest.fn();
      cookieBotAddListener();
      expect(window.addEventListener).not.toHaveBeenCalled();
    });
  });

  describe('cookieBotRemoveListener', () => {
    afterEach(() => {
      jest.clearAllMocks();
      config.enableCookies = true;
    });
    it('calls window.removeEventListener with correct params if enableCookies and enableCookiebot is true', () => {
      window.removeEventListener = jest.fn();
      cookieBotRemoveListener();
      expect(window.removeEventListener).toHaveBeenCalledWith('CookiebotOnDialogDisplay', cookieBotImageOverride);
    });
    it('does not call window.removeEventListener when enableCookies is false', () => {
      config.enableCookies = false;
      window.removeEventListener = jest.fn();
      cookieBotRemoveListener();
      expect(window.removeEventListener).not.toHaveBeenCalled();
    });
    it('does not call window.removeEventListener when enableCookiebot is false', () => {
      config.enableCookiebot = false;
      window.removeEventListener = jest.fn();
      cookieBotRemoveListener();
      expect(window.removeEventListener).not.toHaveBeenCalled();
    });
  });

  describe('getConsentScripts', () => {
    it('returns the Cookiebot script element', () => {
      const element = getCookieBotConsentScripts();

      const { container } = render(<div>{element}</div>);

      expect(container).toMatchSnapshot();
    });
  });
  describe('getCookieScripts', () => {
    it('returns a script element', () => {
      const element = getCookieBotScripts();

      const { container } = render(<div>{element}</div>);

      expect(container).toMatchSnapshot();
    });
  });

  describe('isCookiebotEnabled', () => {
    afterEach(() => {
      jest.clearAllMocks();
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
});
