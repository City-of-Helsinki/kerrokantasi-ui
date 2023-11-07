/* eslint-disable react/no-find-dom-node */
import React from 'react';
import { renderIntoDocument } from 'react-dom/test-utils';
import { findDOMNode } from 'react-dom';
import { MemoryRouter } from 'react-router-dom';

import Header from '../src/components/Header/Header';
import { wireComponent } from '../test-utils';

const MemoryRouterHeader = () => (
  <MemoryRouter>
    <Header />
  </MemoryRouter>
);

describe('Header', () => {
  it('should show a login link when not logged in', () => {
    const comp = renderIntoDocument(wireComponent({ user: { data: null } }, MemoryRouterHeader));
    expect(findDOMNode(comp).querySelector('.login-button')).toBeTruthy();
  });

  it('should show a logout link when logged in', () => {
    const comp = renderIntoDocument(
      wireComponent(
        {
          user: {
            data: {
              id: 'fff',
              displayName: 'Mock von User',
              adminOrganizations: [],
            },
          },
        },
        MemoryRouterHeader,
      ),
    );
    expect(findDOMNode(comp).querySelector('.login-button')).not.toBeTruthy();
    expect(findDOMNode(comp).querySelector('.logout-button')).toBeTruthy();
  });

});
