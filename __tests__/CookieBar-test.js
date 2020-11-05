import React from 'react';

import CookieBar from '../src/components/cookieBar/CookieBar';
import { shallow } from 'enzyme';
import getMessage from '../src/utils/getMessage';

describe('src/components/cookieBar/CookieBar', () => {
  function getWrapper() {
    return shallow(<CookieBar />);
  }

  test('renders CookieBar with correct props', () => {
    const wrapper = getWrapper();
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('buttonId')).toBe('cookie-accept-button');
    expect(wrapper.prop('buttonText')).toEqual(getMessage('cookieBar.accept'));
    expect(wrapper.prop('contentClasses')).toBe('cookie-content');
    expect(wrapper.prop('declineButtonId')).toBe('cookie-decline-button');
    expect(wrapper.prop('declineButtonText')).toEqual(getMessage('cookieBar.decline'));
    expect(wrapper.prop('disableStyles')).toBe(true);
    expect(wrapper.prop('enableDeclineButton')).toBe(true);
    expect(wrapper.prop('onDecline')).toBeDefined();
    expect(wrapper.prop('onAccept')).toBeDefined();
    expect(wrapper.prop('expires')).toBe(90);
    expect(wrapper.prop('setDeclineCookie')).toBe(true);
    expect(wrapper.contains(getMessage('cookieBar.description'))).toBe(true);
  });

  test('renders link to cookie policy with correct props', () => {
    const policyLink = getWrapper().find('a');
    expect(policyLink.length).toBe(1);
    expect(policyLink.prop('id')).toBe('cookiebar-link');
    expect(policyLink.prop('href')).toEqual(getMessage('cookieBar.link.href'));
    expect(policyLink.text()).toEqual(getMessage('cookieBar.link.text'));
  });
});
