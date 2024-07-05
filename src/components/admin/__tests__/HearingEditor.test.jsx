import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { UnconnectedHearingEditor } from '../HearingEditor';
import { mockStore, mockUser } from '../../../../test-utils';
import { notifyError } from '../../../utils/notify';
import renderWithProviders from '../../../utils/renderWithProviders';

jest.mock('../../../utils/notify');

const hearingWithErrors = {
  title: {
    fi: 'yksi',
    sv: '',
  },
  labels: [{ id: 1, label: { fi: 'labelSuomeksi', sv: 'labelSvenska' } }],
  slug: 'urlSlug',
  contact_persons: mockStore.hearing.mockHearing.data.contact_persons,
  open_at: '2021-05-12T21:00:00Z',
  close_at: '2021-11-28T22:00:00Z',
  project: {
    title: { fi: 'nimi', sv: 'namn' },
    phases: [
      {
        title: { fi: 'vaihe', sv: 'fas' },
        is_active: true,
        schedule: {
          fi: '6 päivää',
          sv: '6 dagar',
        },
        description: {
          fi: 'Arviointi',
          sv: 'Evaluering',
        },
      },
    ],
  },
};

const renderComponent = (propOverrides) => {
  const props = {
    contactPersons: [],
    dispatch: jest.fn(),
    show: true,
    hearing: {
      ...mockStore.hearing.mockHearing.data,
      ...hearingWithErrors,
    },
    hearingLanguages: ['fi'],
    labels: [{ id: 1, label: 'text' }],
    user: mockUser,
    language: 'fi',
    isNewHearing: true,
    fetchEditorContactPersons: jest.fn().mockResolvedValue(mockStore.hearing.mockHearing.data.contact_persons),
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <UnconnectedHearingEditor {...props} />
    </MemoryRouter>,
  );
};

describe('<HearingEditor />', () => {
  const originalInterSectionObserver = window.IntersectionObserver;

  const intersectionObserverMock = () => ({
    observe: () => null,
    disconnect: () => null,
  });

  beforeAll(() => {
    window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);
  });

  afterAll(() => {
    window.IntersectionObserver = originalInterSectionObserver;

    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    renderComponent();
  });

  it('should validate hearing', async () => {
    renderComponent({ hearingLanguages: ['fi', 'sv'] });

    const button = await screen.findByRole('button', { name: 'saveHearingChanges' });
    const user = userEvent.setup();

    user.click(button);

    await waitFor(() => expect(notifyError).toHaveBeenCalled());
  });
});
