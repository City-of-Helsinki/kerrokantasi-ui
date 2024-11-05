import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithProviders from '../../../../utils/renderWithProviders';
import IframeCopyPasteField from '../IframeCopyPasteField';

const renderComponent = (propOverrides) => {
  const props = {
    updateAttributes: vi.fn(),
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <IframeCopyPasteField {...props} />
    </MemoryRouter>,
  );
};

describe('<IframeSelectField />', () => {
  it('should render correctly', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
  });

  it('should handleCopyPasteChange', async () => {
    renderComponent();

    const input = await screen.findByRole('textbox');

    const user = userEvent.setup();

    user.type(input, 'test');

    await waitFor(() => expect(input.value).toBe('test'));
  });
});
