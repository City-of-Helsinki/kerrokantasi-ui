import React from 'react';
import cookieUtils from '../../src/utils/cookieUtils';
import {shallow} from 'enzyme';
// eslint-disable-next-line import/no-unresolved
import cookiebotUtils from '../../src/utils/cookiebotUtils';

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

import config from '../../src/config';

jest.mock('../../src/config', () => {
  return {
    enableCookies: true
  };
});

describe('cookieUtils', () => {
  describe('getCookieScripts', () => {
    describe('when isCookiebotEnabled returns true', () => {
      mockIsCookiebotEnabled.mockReturnValueOnce(true);

      afterEach(() => {
        jest.clearAllMocks();
      });

      test('returns cookiebotUtils getCookieScripts', () => {
        expect(cookieUtils.getCookieScripts()).toEqual(cookiebotUtils.getCookieBotScripts());
      });
    });

    describe('when isCookiebotEnabled returns false', () => {
      mockIsCookiebotEnabled.mockReturnValue(false);
      afterEach(() => {
        jest.clearAllMocks();
      });

      test('when cookies are enabled, calls addCookieScripts', () => {
        config.enableCookies = true;
        expect(cookieUtils.getCookieScripts()).toEqual(true);
      });

      test('when cookies are not enabled, returns null', () => {
        config.enableCookies = false;
        expect(cookieUtils.getCookieScripts()).toBe(null);
      });
    });
  });
});
