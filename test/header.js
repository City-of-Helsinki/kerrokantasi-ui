import {renderIntoDocument} from 'react-addons-test-utils';
import Header from 'components/Header';
import {findDOMNode} from 'react-dom';
import {wireComponent, createTestStore} from './utils';
import React from 'react';

describe('Header', () => {
  it('should show a login link when not logged in', () => {
    const comp = renderIntoDocument(wireComponent({user: null}, Header));
    expect(findDOMNode(comp).querySelector(".login-link")).to.be.ok;
  });
  it('should show an username when logged in', () => {
    const comp = renderIntoDocument(wireComponent({user: {id: "fff", displayName: "Mock von User"}}, Header));
    expect(findDOMNode(comp).querySelector(".login-link")).to.not.be.ok;
    expect(findDOMNode(comp).innerHTML).to.contain("Mock von User");
  });
});
