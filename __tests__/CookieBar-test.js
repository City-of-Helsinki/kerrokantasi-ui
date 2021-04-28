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
    const component = wrapper.find("CookieConsent").first();
    expect(component).toHaveLength(1);
    expect(component.prop('buttonId')).toBe('cookie-accept-button');
    expect(component.prop('buttonText')).toEqual(getMessage('cookieBar.accept'));
    expect(component.prop('contentClasses')).toBe('cookie-content');
    expect(component.prop('declineButtonId')).toBe('cookie-decline-button');
    expect(component.prop('declineButtonText')).toEqual(getMessage('cookieBar.decline'));
    expect(component.prop('disableStyles')).toBe(true);
    expect(component.prop('enableDeclineButton')).toBe(true);
    expect(component.prop('onDecline')).toBeDefined();
    expect(component.prop('onAccept')).toBeDefined();
    expect(component.prop('expires')).toBe(90);
    expect(component.prop('setDeclineCookie')).toBe(true);
    expect(component.prop('flipButtons')).toBe(true);
    expect(component.contains(getMessage('cookieBar.description'))).toBe(true);
  });

  test('renders link to cookie policy with correct props', () => {
    const policyLink = getWrapper().find('a');
    expect(policyLink.length).toBe(1);
    expect(policyLink.prop('id')).toBe('cookiebar-link');
    //expect(policyLink.prop('href')).toEqual(getMessage('cookieBar.link.href'));
    expect(policyLink.text()).toEqual(getMessage('cookieBar.link.text'));
  });
});
