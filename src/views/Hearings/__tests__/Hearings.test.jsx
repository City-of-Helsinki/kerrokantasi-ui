import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';

import { Hearings } from '../index';
import { mockStore, getIntlAsProp } from '../../../../test-utils';
import renderWithProviders from '../../../utils/renderWithProviders';

const renderComponent = (propOverrides) => {
  const { labels, ...rest } = mockStore;

  const props = {
    labels: labels.data,
    ...rest,
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <Hearings intl={getIntlAsProp()} {...props} />
    </MemoryRouter>,
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
