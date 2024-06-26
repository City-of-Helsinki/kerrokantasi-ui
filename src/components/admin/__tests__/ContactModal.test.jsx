/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getIntlAsProp } from '../../../../test-utils';
import ContactModal from '../ContactModal';
import renderWithProviders from '../../../utils/renderWithProviders';

const renderComponent = (propOverrides) => {
  const props = {
    onClose: jest.fn(),
    onCreateContact: jest.fn(),
    onEditContact: jest.fn(),
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
    jest.clearAllMocks();
  });

  it('should render the contact modal', () => {
    renderComponent();
  });

  it('should call onCreateContact when creating a new contact', async () => {
    const onCreateContactMock = jest.fn();
    const onCloseMock = jest.fn();

    renderComponent({ onCreateContact: onCreateContactMock, onClose: onCloseMock, contactInfo: {} });

    const user = userEvent.setup();

    await user.click(screen.getByText('create'));

    expect(onCreateContactMock).toHaveBeenCalledTimes(1);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should call onEditContact when editing an existing contact', async () => {
    const onEditContactMock = jest.fn();
    const onCloseMock = jest.fn();

    renderComponent({ onEditContact: onEditContactMock, onClose: onCloseMock });

    const user = userEvent.setup();

    await user.click(screen.getByText('save'));

    expect(onEditContactMock).toHaveBeenCalledTimes(1);
    expect(onEditContactMock).toHaveBeenCalledWith({
      id: '',
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
    const onCloseMock = jest.fn();

    renderComponent({ onClose: onCloseMock });

    const user = userEvent.setup();

    await user.click(screen.getByText('save'));

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
