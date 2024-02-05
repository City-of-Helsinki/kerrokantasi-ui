import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import RichTextModalTextField from '../RichTextModalTextField';
import renderWithProviders from '../../../utils/renderWithProviders';

const renderComponent = (propOverrides) => {
  const props = {
    name: 'test-name',
    label: 'test-label',
    handleInputChange: jest.fn(),
    handleInputBlur: jest.fn(),
    value: 'test-value',
    formName: 'test-form',
    isRequired: true,
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <RichTextModalTextField {...props} />
    </MemoryRouter>,
  );
};

describe('<RichTextModalTextField />', () => {
  it('should render correctly', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
  });

  it('should handleInputChange', async () => {
    const handleInputChangeMock = jest.fn();
    const handleInputBlurMock = jest.fn();

    renderComponent({ handleInputChange: handleInputChangeMock, handleInputBlur: handleInputBlurMock });

    const input = await screen.findByTestId('test-form-test-name');

    const user = userEvent.setup();

    user.type(input, 'test');

    await waitFor(() => expect(handleInputChangeMock).toHaveBeenCalled());

    user.click(document.body);

    await waitFor(() => expect(handleInputBlurMock).toHaveBeenCalled());
  });
});
