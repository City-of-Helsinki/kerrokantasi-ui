import React from 'react';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { MemoryRouter } from 'react-router-dom';
import { act, screen } from '@testing-library/react';

import HearingContainerComponent from '../HearingContainer';
import renderWithProviders from '../../../utils/renderWithProviders';
import { mockStore as mockData, mockUser } from '../../../../test-utils';
import { replace } from '../../../mockable-fetch';


const mockFetch = jest.fn(() => {
  Promise.resolve({})
});
beforeAll(() => {
    replace(mockFetch);
})
afterEach(() => {
    jest.clearAllMocks();
});
afterAll(() => {
    replace(false);
})

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    hearingSlug: 'isosaari',
  }),
}));

jest.mock('../../../components/admin/HearingEditor', () => () => (<div data-testid="hearingEditor">HearingEditor</div>))

jest.mock('../../../actions', () => ({
  ...jest.requireActual('../../../actions'),
  fetchHearing: () => jest.fn(),
  fetchProjects: () => jest.fn(),
  fetchSectionComments: () => jest.fn(),
}))

jest.mock('../../../actions/hearingEditor', () => ({
  ...jest.requireActual('../../../actions/hearingEditor'),
  fetchHearingEditorMetaData: () => jest.fn(),
}))

jest.mock('../../../utils/hearing', () => ({
  ...jest.requireActual('../../../utils/hearing'),
  canEdit: () => jest.fn(() => true)
}))

const renderComponent = (store) => renderWithProviders(
    <MemoryRouter >
      <HearingContainerComponent />
    </MemoryRouter>,
    { store }
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
    })
    expect(screen.getByTestId('load-spinner')).toBeInTheDocument();
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
      user,
      sectionComments: [],
      accessibility: {
        isHighContrast: false,
      },
    });

    await act(async () => {
      renderComponent(store);
    })
    await expect(screen.getByText(mockHearingWithSections.data.title.fi)).toBeInTheDocument();
  });

  test('renders HearingEditor when user can edit hearing',  async () => {
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
    })
    expect(screen.getByTestId('hearingEditor')).toBeInTheDocument();
  });
});