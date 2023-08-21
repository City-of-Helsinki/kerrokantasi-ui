/* eslint-disable import/no-unresolved */
import React from 'react';
import { shallow } from 'enzyme';
import urls from '@city-assets/urls.json';

import {
  cookieBotAddListener,
  cookieBotRemoveListener,
  cookieBotImageOverride,
  getCookieBotConsentScripts,
  getCookieBotScripts,
  isCookiebotEnabled,
} from '../../src/utils/cookiebotUtils';
import config from '../../src/config';

// eslint-disable-next-line import/no-unresolved

jest.mock('../../src/config', () => ({
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
    test('calls window.addEventListener with correct params if enableCookies and enableCookiebot is true', () => {
      window.addEventListener = jest.fn();
      cookieBotAddListener();
      expect(window.addEventListener).toHaveBeenCalledWith('CookiebotOnDialogDisplay', cookieBotImageOverride);
    });
    test('does not call window.addEventListener when enableCookies is false', () => {
      config.enableCookies = false;
      window.addEventListener = jest.fn();
      cookieBotAddListener();
      expect(window.addEventListener).not.toHaveBeenCalled();
    });
    test('does not call window.addEventListener when enableCookiebot is false', () => {
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
    test('calls window.removeEventListener with correct params if enableCookies and enableCookiebot is true', () => {
      window.removeEventListener = jest.fn();
      cookieBotRemoveListener();
      expect(window.removeEventListener).toHaveBeenCalledWith('CookiebotOnDialogDisplay', cookieBotImageOverride);
    });
    test('does not call window.removeEventListener when enableCookies is false', () => {
      config.enableCookies = false;
      window.removeEventListener = jest.fn();
      cookieBotRemoveListener();
      expect(window.removeEventListener).not.toHaveBeenCalled();
    });
    test('does not call window.removeEventListener when enableCookiebot is false', () => {
      config.enableCookiebot = false;
      window.removeEventListener = jest.fn();
      cookieBotRemoveListener();
      expect(window.removeEventListener).not.toHaveBeenCalled();
    });
  });
  describe('getConsentScripts', () => {
    test('returns the Cookiebot script element', () => {
      const element = getCookieBotConsentScripts();
      const wrapper = shallow(<div>{element}</div>);
      expect(wrapper.find('script')).toHaveLength(1);
      expect(wrapper.find('script').prop('id')).toBe('Cookiebot');
      expect(wrapper.find('script').prop('data-blockingmode')).toBe('auto');
      expect(wrapper.find('script').prop('data-cbid')).toBe(config.cookiebotDataCbid);
      expect(wrapper.find('script').prop('src')).toBe('https://consent.cookiebot.com/uc.js');
      expect(wrapper.find('script').prop('type')).toBe('text/javascript');
    });
  });
  describe('getCookieScripts', () => {
    test('returns a script element', () => {
      const element = getCookieBotScripts();
      const wrapper = shallow(<div>{element}</div>);
      expect(wrapper.find('script')).toHaveLength(1);
      expect(wrapper.find('script').prop('data-cookieconsent')).toEqual('statistics');
      expect(wrapper.find('script').prop('src')).toEqual(urls.analytics);
      expect(wrapper.find('script').prop('type')).toEqual('text/plain');
    });
  });

  describe('isCookiebotEnabled', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test('returns true when both cookies and Cookiebot are enabled', () => {
      config.enableCookies = true;
      config.enableCookiebot = true;
      expect(isCookiebotEnabled()).toBe(true);
    });

    test('returns false when cookies are not enabled', () => {
      config.enableCookies = false;
      config.enableCookiebot = true;
      expect(isCookiebotEnabled()).toBe(false);
    });

    test('returns false when Cookiebot is not enabled', () => {
      config.enableCookies = true;
      config.enableCookiebot = false;
      expect(isCookiebotEnabled()).toBe(false);
    });
  });
});
