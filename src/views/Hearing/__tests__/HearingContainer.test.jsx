import React from 'react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { MemoryRouter } from 'react-router-dom';
import { act, screen } from '@testing-library/react';

import HearingContainerComponent from '../HearingContainer';
import renderWithProviders from '../../../utils/renderWithProviders';
import { mockStore as mockData, mockUser } from '../../../../test-utils';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');

  return {
    ...mod,
    useParams: () => ({
      hearingSlug: 'isosaari',
    }),
  };
});

vi.mock('../../../components/admin/HearingEditor', () => ({
  default: () => <div data-testid='hearingEditor'>HearingEditor</div>,
}));

vi.mock('../../../actions', async () => {
  const mod = await vi.importActual('../../../actions');

  return {
    ...mod,
    fetchHearing: () => vi.fn().mockResolvedValue({}),
    fetchProjects: () => vi.fn(),
    fetchSectionComments: () => vi.fn(),
  };
});

vi.mock('../../../actions/hearingEditor', async () => {
  const mod = await vi.importActual('../../../actions/hearingEditor');

  return {
    ...mod,
    fetchHearingEditorMetaData: () => vi.fn(),
  };
});

vi.mock('../../../utils/hearing', async () => {
  const mod = await vi.importActual('../../../utils/hearing');

  return {
    ...mod,
    canEdit: () => vi.fn(() => true),
  };
});

const renderComponent = (store) =>
  renderWithProviders(
    <MemoryRouter>
      <HearingContainerComponent />
    </MemoryRouter>,
    { store },
  );

describe('<HearingContainer />', () => {
  test('renders correctly when hearing is empty', async () => {
    const store = mockStore({
      hearing: {},
      hearingEditor: {
        languages: ['en', 'fi'],
        organizations: { all: [] },
        hearing: {},
        labels: { all: [], byId: {} },
        editorState: {
          show: false,
          pending: 0,
          isSaving: false,
        },
      },
      user: {},
      isLoading: false,
    });

    await act(async () => {
      renderComponent(store);
    });
    expect(screen.getByText('hearingNotFound')).toBeInTheDocument();
  });

  test('renders correctly when hearing is not empty', async () => {
    const { mockHearingWithSections, labels } = mockData;
    const user = mockUser;

    const store = mockStore({
      hearing: {
        isosaari: mockHearingWithSections,
      },
      hearingEditor: {
        languages: ['en', 'fi'],
        organizations: { all: [{ name: 'Kaupunkisuunnitteluvirasto', external_organization: false, frontId: '123' }] },
        hearing: mockHearingWithSections.data,
        labels: { all: ['1', '2'], byId: labels.data },
        editorState: {
          show: false,
          pending: 0,
          isSaving: false,
        },
      },
      user: {
        data: user,
      },
      sectionComments: [],
      accessibility: {
        isHighContrast: false,
      },
    });

    await act(async () => {
      renderComponent(store);
    });
    await expect(screen.getByText(mockHearingWithSections.data.title.fi)).toBeInTheDocument();
  });

  test('renders HearingEditor when user can edit hearing', async () => {
    const { mockHearingWithSections, labels } = mockData;
    const user = mockUser;

    const store = mockStore({
      hearing: {
        isosaari: mockHearingWithSections,
      },
      hearingEditor: {
        languages: ['en', 'fi'],
        organizations: { all: [{ name: 'Kaupunkisuunnitteluvirasto', external_organization: false, frontId: '123' }] },
        hearing: mockHearingWithSections.data,
        labels: { all: ['1', '2'], byId: labels.data },
        editorState: {
          show: false,
          pending: 0,
          isSaving: false,
        },
      },
      sectionComments: [],
      accessibility: {
        isHighContrast: false,
      },
      user: {
        data: user,
      },
      labels: [],
      contactPersons: [],
    });

    await act(async () => {
      renderComponent(store);
    });
    expect(screen.getByTestId('hearingEditor')).toBeInTheDocument();
  });
});
