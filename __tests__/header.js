/* eslint-disable react/no-find-dom-node */
import React from 'react';
import { renderIntoDocument } from 'react-dom/test-utils';
import Header from '../src/components/Header';
import { findDOMNode } from 'react-dom';
import { wireComponent } from '../test-utils';
import { MemoryRouter } from 'react-router-dom';

const MemoryRouterHeader = () => <MemoryRouter><Header /></MemoryRouter>;

describe('Header', () => {
  it('should show a login link when not logged in', () => {
    const comp = renderIntoDocument(wireComponent({ user: { data: null } }, MemoryRouterHeader));
    expect(findDOMNode(comp).querySelector(".login-link")).toBeTruthy();
  });

  it('should show an username when logged in', () => {
    const comp = renderIntoDocument(wireComponent(
      {
        user: {
          data: {
            id: "fff",
            displayName: "Mock von User",
            adminOrganizations: []
          }
        }
      }, MemoryRouterHeader));

    expect(findDOMNode(comp).querySelector(".login-link")).not.toBeTruthy();
    expect(findDOMNode(comp).innerHTML).toContain("Mock von User");
  });
});
