import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { Labels } from '../LabelList';
import renderWithProviders from '../../utils/renderWithProviders';
import { getIntlAsProp } from '../../../test-utils';

const defaultProps = {
  labels: [],
};

const renderComponent = (props) =>
  renderWithProviders(
    <MemoryRouter>
      <Labels className='labels' store={{}} intl={getIntlAsProp()} {...defaultProps} {...props} />
    </MemoryRouter>,
  );

describe('<LabelList />', () => {
  it('should render empty list', () => {
    renderComponent();
  });

  it('should render list of label objects', () => {
    const labels = [
      { id: 1, label: 'such' },
      { id: 2, label: 'label' },
    ];

    const { getAllByRole } = renderComponent({ labels });

    expect(getAllByRole('link')).toHaveLength(2);
  });
});
