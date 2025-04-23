import React from 'react';
import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getIntlAsProp } from '../../../../test-utils';
import ContactModal from '../ContactModal';
import renderWithProviders from '../../../utils/renderWithProviders';

const renderComponent = (propOverrides) => {
  const props = {
    onClose: vi.fn(),
    onCreateContact: vi.fn(),
    onEditContact: vi.fn(),
    organizations: [
      { id: 'org1', name: 'Organization 1' },
      { id: 'org2', name: 'Organization 2' },
    ],
    contactInfo: {
      id: 'contact1',
      name: 'John Doe',
      phone: '123456789',
      email: 'john.doe@example.com',
      organization: 'org1',
      additional_info: 'Additional info',
      title: {
        fi: 'Title in Finnish',
        en: 'Title in English',
      },
    },
    ...propOverrides,
  };

  return renderWithProviders(<ContactModal intl={getIntlAsProp()} isOpen {...props} />);
};

describe('<ContactModal />', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the contact modal', () => {
    renderComponent();
  });

  it('should call onCreateContact when creating a new contact', async () => {
    const onCreateContactMock = vi.fn(() => true);
    const onCloseMock = vi.fn();

    renderComponent({ onCreateContact: onCreateContactMock, onClose: onCloseMock, contactInfo: {} });

    const user = userEvent.setup();

    await act(async () => {
      await user.click(screen.getByText('create'));
    });

    await expect(onCreateContactMock).toHaveBeenCalledTimes(1);
    await expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should call onEditContact when editing an existing contact', async () => {
    const onEditContactMock = vi.fn(() => true);
    const onCloseMock = vi.fn();

    renderComponent({ onEditContact: onEditContactMock, onClose: onCloseMock });

    const user = userEvent.setup();

    await act(async () => {
      await user.click(screen.getByText('save'));
    });

    expect(onEditContactMock).toHaveBeenCalledTimes(1);
    expect(onEditContactMock).toHaveBeenCalledWith({
      id: 'contact1',
      name: 'John Doe',
      phone: '123456789',
      email: 'john.doe@example.com',
      organization: 'org1',
      additional_info: 'Additional info',
      title: {
        fi: 'Title in Finnish',
      },
    });
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when cancel button is clicked', async () => {
    const onCloseMock = vi.fn();

    renderComponent({ onClose: onCloseMock });

    const user = userEvent.setup();

    await user.click(screen.getByText('cancel'));

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
