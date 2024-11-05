import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import Info from '..';
import renderWithProviders from '../../../utils/renderWithProviders';

const mockStore = configureStore([]);

describe('<Info />', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    fetch.resetMocks();
  });

  const renderComponent = (locale) => renderWithProviders(<Info />, { store, locale });

  it('should render the component with Finnish content', async () => {
    fetch.mockResolvedValueOnce({
      text: vi.fn().mockResolvedValue('Finnish content'),
    });

    renderComponent('fi');

    await waitFor(() => {
      expect(screen.getByText('Finnish content')).toBeInTheDocument();
    });
  });

  it('should render the component with Swedish content', async () => {
    fetch.mockResolvedValueOnce({
      text: vi.fn().mockResolvedValue('Swedish content'),
    });

    renderComponent('sv');

    await waitFor(() => {
      expect(screen.getByText('Swedish content')).toBeInTheDocument();
    });
  });

  it('should render the component with English content', async () => {
    fetch.mockResolvedValueOnce({
      text: vi.fn().mockResolvedValue('English content'),
    });

    renderComponent('en');

    await waitFor(() => {
      expect(screen.getByText('English content')).toBeInTheDocument();
    });
  });
});
