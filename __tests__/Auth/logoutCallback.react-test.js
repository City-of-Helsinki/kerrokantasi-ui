import { shallow } from 'enzyme';
import React from 'react';

import { UnconnectedLogoutCallback as LogoutCallback } from '../../src/views/Auth/logoutCallback';

describe('src/views/Auth/logoutCallback', () => {
  const dispatch = jest.fn();

  function getWrapper(props) {
    const defaultProps = {
      dispatch,
    };
    return shallow(<LogoutCallback {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    test('SignoutCallbackComponent with correct props', () => {
      const callbackWrapper = getWrapper();
      expect(callbackWrapper.length).toBe(1);
      expect(callbackWrapper.prop('errorCallback')).toBeDefined();
      expect(callbackWrapper.prop('successCallback')).toBeDefined();
      expect(callbackWrapper.prop('userManager')).toBeDefined();
    });

    test('empty div', () => {
      const emptyDiv = getWrapper().find('div');
      expect(emptyDiv.length).toBe(1);
    });
  });

  describe('logoutSuccessful', () => {
    afterEach(() => {
      dispatch.mockReset();
    });

    test('calls dispatch push with correct path', () => {
      const instance = getWrapper().instance();
      instance.logoutSuccessful();

      expect(dispatch.mock.calls.length).toBe(1);
      expect(dispatch.mock.calls[0][0].payload.method).toBe('push');
      expect(dispatch.mock.calls[0][0].payload.args[0]).toBe('/');
    });
  });

  describe('logoutUnsuccessful', () => {
    afterEach(() => {
      dispatch.mockReset();
    });

    test('calls dispatch push with correct path', () => {
      const instance = getWrapper().instance();
      instance.logoutUnsuccessful();

      expect(dispatch.mock.calls.length).toBe(1);
      expect(dispatch.mock.calls[0][0].payload.method).toBe('push');
      expect(dispatch.mock.calls[0][0].payload.args[0]).toBe('/');
    });
  });
});
