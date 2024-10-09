import React from 'react';
import configureStore from 'redux-mock-store';

import Info from '..';
import renderWithProviders from '../../../utils/renderWithProviders';

const mockStore = configureStore([]);

jest.mock('@city-i18n/service-info/content.fi.md', () => '<p>Finnish Content</p>', { virtual: true });
jest.mock('@city-i18n/service-info/content.sv.md', () => '<p>Swedish Content</p>', { virtual: true });
jest.mock('@city-i18n/service-info/content.en.md', () => '<p>English Content</p>', { virtual: true });

describe('<Info />', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  const renderComponent = (locale) => renderWithProviders(<Info />, { store, locale });

  it('renders correctly with English content', () => {
    const { getByText } = renderComponent('en');
    expect(getByText('English Content')).toBeInTheDocument();
  });

  it('renders correctly with Finnish content', () => {
    const { getByText } = renderComponent('fi');
    expect(getByText('Finnish Content')).toBeInTheDocument();
  });

  it('renders correctly with Swedish content', () => {
    const { getByText } = renderComponent('sv');
    expect(getByText('Swedish Content')).toBeInTheDocument();
  });
});
