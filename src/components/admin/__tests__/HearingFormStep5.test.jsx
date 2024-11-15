import React from 'react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import HearingFormStep5 from '../HearingFormStep5';
import renderWithProviders from '../../../utils/renderWithProviders';
import { getIntlAsProp } from '../../../../test-utils';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const storeInitialState = {
  projectLists: {
    isFetching: false,
    data: [
      {
        id: '123',
        title: {
          en: 'en',
          fi: 'fi',
          sv: 'sv',
        },
        phases: [
          {
            id: '3456',
            has_hearings: true,
            hearings: ['test'],
            title: {
              en: 'en',
              fi: 'fi',
              sv: 'sv',
            },
            description: {
              en: 'test',
              fi: 'test',
              sv: 'test',
            },
            schedule: {
              en: '2024',
              fi: '2024',
              sv: '2024',
            },
          },
        ],
      },
    ],
  },
};

const renderComponent = (propOverrides, storeOverride) => {
  const props = {
    errors: {},
    hearing: {
      project: {
        id: '123',
        title: {
          en: 'en',
          fi: 'fi',
          sv: 'sv',
        },
        phases: [
          {
            id: '3456',
            has_hearings: true,
            hearings: ['test'],
            title: {
              en: 'en',
              fi: 'fi',
              sv: 'sv',
            },
            description: {
              en: 'test',
              fi: 'test',
              sv: 'test',
            },
            schedule: {
              en: '2024',
              fi: '2024',
              sv: '2024',
            },
          },
        ],
      },
    },
    hearingLanguages: ['en', 'fi', 'sv'],
    language: 'en',
    projects: [
      {
        id: '123',
        title: {
          en: 'test',
          fi: 'test',
          sv: 'test',
        },
      },
    ],
    intl: getIntlAsProp(),
    dispatch: jest.fn(),
    ...propOverrides,
  };

  const store = storeOverride || mockStore(storeInitialState);

  return renderWithProviders(<HearingFormStep5 {...props} />, { store });
};

describe('<HearingFormStep5 />', () => {
  it('should render correctly', () => {
    renderComponent();
  });

  it('should call dispatch when changing project', async () => {
    const store = mockStore(storeInitialState);

    renderComponent({}, store);

    const user = userEvent.setup();
    const input = screen.getByRole('button', { name: /projectSelection/i });

    await user.click(input);

    const option = await screen.findByText('en');

    await user.click(option);

    const actions = store.getActions();
    const expected = [
      {
        type: 'changeProject',
        payload: { projectId: '123', projectLists: expect.anything() },
      },
    ];

    expect(actions).toEqual(expected);
  });

  it('should call dispatch when adding a phase', () => {
    const store = mockStore(storeInitialState);

    renderComponent({}, store);

    fireEvent.click(screen.getByText(/addProcess/i));

    const actions = store.getActions();
    const expected = [{ type: 'addPhase' }];

    expect(actions).toEqual(expected);
  });

  it('should display error notification when no phases and error exists', () => {
    renderComponent({
      errors: { project_phase_active: 'Error message' },
      hearing: { project: { id: '123', title: { fi: '', en: '', sv: '' }, phases: [] } },
    });

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});
