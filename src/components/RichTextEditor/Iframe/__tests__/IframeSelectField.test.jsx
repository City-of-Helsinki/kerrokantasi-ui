import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import IframeSelectField from '../IframeSelectField';
import renderWithProviders from '../../../../utils/renderWithProviders';

const renderComponent = (propOverrides) => {
  const props = {
    name: 'test-name',
    label: 'test-label',
    handleInputChange: jest.fn(),
    value: 'test-value',
    options: [
      { value: 'no', text: 'text-no' },
      { value: 'yes', text: 'text-yes' },
    ],
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <IframeSelectField {...props} />
    </MemoryRouter>,
  );
};

describe('<IframeSelectField />', () => {
  it('should render correctly', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
  });

  it('should handle input onChange', async () => {
    const handleInputChangeMock = jest.fn();

    renderComponent({ handleInputChange: handleInputChangeMock });

    const select = await screen.findByRole('combobox');
    const option = await screen.findByRole('option', { name: 'text-no' });

    const user = userEvent.setup();

    await user.selectOptions(select, option);

    await waitFor(() => expect(handleInputChangeMock).toHaveBeenCalled());
  });
});
