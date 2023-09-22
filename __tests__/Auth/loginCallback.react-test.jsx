import { shallow } from 'enzyme';
import React from 'react';

import { UnconnectedCallbackPage } from '../../src/views/Auth/loginCallback';

describe('src/views/Auth/loginCallback', () => {
  const dispatch = jest.fn();

  function getWrapper(props) {
    const defaultProps = {
      dispatch,
    };
    return shallow(<UnconnectedCallbackPage {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    test('CallbackComponent with correct props', () => {
      const callbackWrapper = getWrapper();
      expect(callbackWrapper.length).toBe(1);
      expect(callbackWrapper.prop('errorCallback')).toBeDefined();
      expect(callbackWrapper.prop('successCallback')).toBeDefined();
      expect(callbackWrapper.prop('userManager')).toBeDefined();
    });

    test('a div', () => {
      const div = getWrapper().find('div');
      expect(div.length).toBe(1);
    });
  });

  describe('success', () => {
    afterEach(() => {
      dispatch.mockReset();
    });

    test('calls dispatch push with correct path', () => {
      const instance = getWrapper().instance();
      instance.success();

      expect(dispatch.mock.calls.length).toBe(1);
      expect(dispatch.mock.calls[0][0].payload.method).toBe('push');
      expect(dispatch.mock.calls[0][0].payload.args[0]).toBe('/');
    });
  });

  describe('failure', () => {
    afterEach(() => {
      dispatch.mockReset();
    });

    test('calls dispatch push with correct path', () => {
      const instance = getWrapper().instance();
      instance.failure();

      expect(dispatch.mock.calls.length).toBe(1);
      expect(dispatch.mock.calls[0][0].payload.method).toBe('push');
      expect(dispatch.mock.calls[0][0].payload.args[0]).toBe('/');
    });
  });
});
