import { screen } from '@testing-library/react'
import React from 'react';
import { createBrowserHistory } from 'history';

import {UnconnectedLoginCallback} from '../../src/views/Auth/loginCallback';
import renderWithProviders from '../../src/utils/renderWithProviders';


describe('src/views/Auth/loginCallback', () => {


  function renderComponent(props) {
    const defaultProps = {
      history: createBrowserHistory(),
    };
    renderWithProviders(<UnconnectedLoginCallback {...defaultProps} {...props} />);
  }

  describe('renders', () => {
    test('CallbackComponent with correct props', () => {
      renderComponent({});
      expect(screen.getByText('Redirecting...')).toBeTruthy();
    });
  });
});
