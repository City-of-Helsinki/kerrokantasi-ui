import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';

import SkipLinkModal from '../SkipLinkModal';
import renderWithProviders from '../../../../utils/renderWithProviders';

const renderComponent = (propOverrides) => {
  const props = {
    isOpen: true,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <SkipLinkModal {...props} />
    </MemoryRouter>,
  );
};

describe('<SkipLinkModal />', () => {
  it('should render correctly', () => {
    renderComponent();
  });

  it('should handle input changes', () => {
    renderComponent();

    const user = userEvent.setup();

    const inputs = ['skip-link-linkText', 'skip-link-linkOwnId', 'skip-link-linkTargetId'];

    inputs.forEach(async (input) => {
      const formInput = await screen.findByTestId(input);

      await user.type(formInput, 'test text');

      await waitFor(() => expect(input.getAttribute('value')).toBe('test text'));
    });
  });

  it('should validate form', async () => {
    renderComponent();

    const user = userEvent.setup();

    const button = await screen.findByRole('button', { name: 'formButtonAcceptAndAdd' });

    user.click(button);

    expect(await screen.findAllByText(/Tämä kenttä ei voi olla tyhjä/i)).toHaveLength(3);
  });

  it('should show form error message when form is invalid', async () => {
    renderComponent();

    const button = await screen.findByRole('button', { name: 'formButtonAcceptAndAdd' });
    userEvent.click(button);

    const errorMessage = await screen.findByTestId('skip-link-form-submit-error');

    expect(errorMessage).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', async () => {
    const onCloseMock = jest.fn();

    renderComponent({ onClose: onCloseMock });

    const cancelButton = screen.getByRole('button', { name: 'cancel' });
    userEvent.click(cancelButton);

    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });
});
