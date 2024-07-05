import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import Hearings from '../index';
import { mockStore, getIntlAsProp, mockUser } from '../../../../test-utils';
import renderWithProviders from '../../../utils/renderWithProviders';
import createAppStore from '../../../createStore';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/hearings/list',
    search: '',
  }),
}));

const renderComponent = (propOverrides) => {
  const { labels, hearingLists, ...rest } = mockStore;

  const props = {
    labels: labels.data,
    ...rest,
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <Hearings {...props} />
    </MemoryRouter>
  );
};

describe('<Hearings />', () => {
  it('should render correctly', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
  });

  it('should render HearingList when labels are present', async () => {
    renderComponent();

    expect(await screen.findAllByRole('listitem')).toHaveLength(1);
  });
});
