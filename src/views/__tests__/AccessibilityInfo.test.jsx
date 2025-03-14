import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';

import AccessibilityInfo from '../AccessibilityInfo';
import { getIntlAsProp } from '../../../test-utils';
import renderWithProviders from '../../utils/renderWithProviders';

const mockStore = configureStore([]);

describe('<AccessibilityInfo />', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    fetch.resetMocks();
  });

  const renderComponent = (props) =>
    renderWithProviders(<AccessibilityInfo intl={getIntlAsProp()} language={props.language} />, {
      store,
      locale: props.language,
    });

  it('should fetch and display Finnish content', async () => {
    fetch.mockResolvedValueOnce({
      text: vi.fn().mockResolvedValue('Finnish content'),
    });

    renderComponent({ language: 'fi' });

    await waitFor(() => {
      expect(screen.getByText('Finnish content')).toBeInTheDocument();
    });
  });

  it('should fetch and display Swedish content', async () => {
    fetch.mockResolvedValueOnce({
      text: vi.fn().mockResolvedValue('Swedish content'),
    });

    renderComponent({ language: 'sv' });

    await waitFor(() => {
      expect(screen.getByText('Swedish content')).toBeInTheDocument();
    });
  });

  it('should fetch and display English content', async () => {
    fetch.mockResolvedValueOnce({
      text: vi.fn().mockResolvedValue('English content'),
    });

    renderComponent({ language: 'en' });

    await waitFor(() => {
      expect(screen.getByText('English content')).toBeInTheDocument();
    });
  });
});
