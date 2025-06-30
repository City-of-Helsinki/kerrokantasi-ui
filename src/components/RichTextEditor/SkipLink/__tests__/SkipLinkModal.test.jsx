import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { screen, waitFor, act } from '@testing-library/react';

import SkipLinkModal from '../SkipLinkModal';
import renderWithProviders from '../../../../utils/renderWithProviders';
import { getIntlAsProp } from '../../../../../test-utils';

const renderComponent = (propOverrides) => {
  const props = {
    isOpen: true,
    intl: getIntlAsProp(),
    onClose: vi.fn(),
    onSubmit: vi.fn(),
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

  it('should call onClose when cancel button is clicked', async () => {
    const onCloseMock = vi.fn();

    renderComponent({ onClose: onCloseMock });

    const cancelButton = await screen.findByRole('button', { name: 'cancel' });

    userEvent.click(cancelButton);

    await waitFor(() => {
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle input changes', async () => {
    renderComponent();

    const user = userEvent.setup();

    const inputs = ['skip-link-linkText', 'skip-link-linkOwnId', 'skip-link-linkTargetId'];

    await act(async () => {
      for (const input of inputs) {
        const formInput = await screen.findByTestId(input);
        await user.type(formInput, 'test text');
        await waitFor(() => expect(formInput.getAttribute('value')).toBe('test text'));
      }
    })
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
});
