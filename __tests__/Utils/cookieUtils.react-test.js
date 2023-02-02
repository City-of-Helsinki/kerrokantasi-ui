import React from 'react';
import cookieUtils from '../../src/utils/cookieUtils';
import {shallow} from 'enzyme';
// eslint-disable-next-line import/no-unresolved
import urls from '@city-assets/urls.json';
import cookiebotUtils from '../../src/utils/cookiebotUtils';

const isCookiebotEnabledMock = jest.fn();
jest.mock('../../src/utils/cookiebotUtils', () => {
  const originalModule = jest.requireActual('../../src/utils/cookiebotUtils');
  return {
    __esModule: true,
    ...originalModule,
    isCookiebotEnabled: isCookiebotEnabledMock,
    default: {
      ...originalModule.default,
      isCookiebotEnabled: () => isCookiebotEnabledMock(),
    }
  };
});

import config from '../../src/config';

jest.mock('../../src/config', () => {
  return {
    enableCookies: true
  };
});

describe('cookieUtils', () => {
  describe('getDefaultCookieScripts', () => {
    test('returns a script element', () => {
      const element = cookieUtils.getDefaultCookieScripts();
      const wrapper = shallow(<div>{element}</div>);
      expect(wrapper.find('script')).toHaveLength(1);
      expect(wrapper.find('script').prop('src')).toEqual(urls.analytics);
      expect(wrapper.find('script').prop('type')).toEqual('text/javascript');
    });
  });

  describe('getCookieScripts', () => {
    describe('when isCookiebotEnabled returns true', () => {
      isCookiebotEnabledMock.mockReturnValueOnce(true);

      afterEach(() => {
        jest.clearAllMocks();
      });

      test('returns cookiebotUtils getCookieScripts', () => {
        expect(cookieUtils.getCookieScripts()).toEqual(cookiebotUtils.getCookieBotScripts());
      });
    });

    describe('when isCookiebotEnabled returns false', () => {
      isCookiebotEnabledMock.mockReturnValue(false);

      afterEach(() => {
        jest.clearAllMocks();
      });

      test('when cookies are enabled, returns getDefaultCookieScripts', () => {
        config.enableCookies = true;
        expect(cookieUtils.getCookieScripts()).toEqual(cookieUtils.getDefaultCookieScripts());
      });

      test('when cookies are not enabled, returns null', () => {
        config.enableCookies = false;
        expect(cookieUtils.getCookieScripts()).toBe(null);
      });
    });
  });
});
