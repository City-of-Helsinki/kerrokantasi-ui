/* eslint-disable no-unused-vars */
import React from 'react';
import { screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';

import Hearings from '../index';
import renderWithProviders from '../../../utils/renderWithProviders';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    search: '?label=1&search=Hearing',
  }),
}));

const mockStore = configureStore([thunk]);

const renderComponent = (storeOverrides) => {
  const store = mockStore({
    hearingLists: {},
    labels: {
      data: [],
    },
    language: 'en',
    user: {
      data: {
        isFetching: false,
      },
    },
    ...storeOverrides,
  });

  return renderWithProviders(
    <BrowserRouter>
      <Hearings />
    </BrowserRouter>,
    { store },
  );
};

describe('<Hearings />', () => {
  it('should render correctly', () => {
    renderComponent();
  });

  it('displays loading spinner when user is fetching', () => {
    renderComponent({ user: { data: { isFetching: true } } });

    expect(screen.getByTestId('load-spinner')).toBeInTheDocument();
  });

  it('displays hearing list when labels are available', async () => {
    renderComponent({
      hearingLists: {
        allHearings: {
          isFetching: false,
          data: [
            { id: 1, title: 'Hearing One' },
            { id: 2, title: 'Hearing Two' },
          ],
        },
      },
      labels: {
        data: [
          { id: 1, label: 'Label One' },
          { id: 2, label: 'Label Two' },
        ],
      },
    });

    expect(await screen.findByText('Hearing One')).toBeInTheDocument();
    expect(await screen.findByText('Hearing Two')).toBeInTheDocument();
  });
});
