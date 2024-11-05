import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';

import IframeModal from '../IframeModal';
import renderWithProviders from '../../../../utils/renderWithProviders';

const SOME_TITLE = 'some title';
const TEST_URL = 'https://google.fi';

const renderComponent = (propOverrides) => {
  const props = {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <IframeModal {...props} />
    </MemoryRouter>,
  );
};

describe('<IframeModal />', () => {
  it('should render correctly', () => {
    renderComponent();
  });

  it('should handle form submission', async () => {
    const onSubmitMock = vi.fn();

    renderComponent({ onSubmit: onSubmitMock });

    const user = userEvent.setup();

    await user.type(await screen.findByTestId('iframe-title'), SOME_TITLE);
    await user.type(await screen.findByTestId('iframe-src'), TEST_URL);

    await user.click(await screen.findByRole('button', { name: 'formButtonAcceptAndAdd' }));

    expect(onSubmitMock).toHaveBeenCalledWith({
      title: SOME_TITLE,
      src: TEST_URL,
      width: '',
      height: '',
      allow: '',
      scrolling: 'no',
      showFormErrorMsg: false,
    });
  });

  it('should display form errors when form is invalid', async () => {
    renderComponent();

    const user = userEvent.setup();

    await user.click(await screen.findByRole('button', { name: 'formButtonAcceptAndAdd' }));

    expect(await screen.findByTestId('iframe-form-submit-error')).toHaveTextContent('Korjaa lomakkeen virheet ensin');
  });
});
