import React from 'react';
import {
  cookieBotAddListener,
  cookieBotRemoveListener,
  cookieBotImageOverride,
  getConsentScripts,
  getCookieScripts
} from '../../src/utils/cookieUtils';
import config from '../../src/config';
import {shallow} from 'enzyme';
// eslint-disable-next-line import/no-unresolved
import urls from '@city-assets/urls.json';

jest.mock('../../src/config', () => {
  return {
    enableCookies: true
  };
});
describe('cookieUtils', () => {
  describe('cookieBotAddListener', () => {
    afterEach(() => {
      jest.clearAllMocks();
      config.enableCookies = true;
    });
    test('calls window.addEventListener with correct params if enableCookies is true', () => {
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
  });
  describe('cookieBotRemoveListener', () => {
    afterEach(() => {
      jest.clearAllMocks();
      config.enableCookies = true;
    });
    test('calls window.removeEventListener with correct params if enableCookies is true', () => {
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
  });
  describe('getConsentScripts', () => {
    test('returns the Cookiebot script element', () => {
      const element = getConsentScripts();
      const wrapper = shallow(<div>{element}</div>);
      expect(wrapper.find('script')).toHaveLength(1);
      expect(wrapper.find('script').prop('id')).toBe('Cookiebot');
    });
  });
  describe('getCookieScripts', () => {
    test('returns a script element', () => {
      const element = getCookieScripts();
      const wrapper = shallow(<div>{element}</div>);
      expect(wrapper.find('script')).toHaveLength(1);
      expect(wrapper.find('script').prop('src')).toEqual(urls.analytics);
    });
  });
});
