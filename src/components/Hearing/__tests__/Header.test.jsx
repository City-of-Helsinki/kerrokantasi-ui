import React from 'react';
import * as RouterMock from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import Header from '../Header';
import { mockStore, getIntlAsProp } from '../../../../test-utils';
import renderWithProviders from '../../../utils/renderWithProviders';
import createAppStore from '../../../createStore';

const { mockHearingWithSections } = mockStore;

vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');

  return {
    ...mod,
    useLocation: vi.fn().mockImplementation(() => ({
      pathname: mockHearingWithSections.data.sections[0].id,
    })),
    useParams: vi.fn().mockImplementation(() => ({
      hearingSlug: mockHearingWithSections.data.id,
    })),
  };
});

const renderComponent = (propOverrides) => {
  const history = createMemoryHistory();

  const storeMock = createAppStore({
    hearing: {
      [mockHearingWithSections.data.id]: {
        data: {
          ...mockHearingWithSections.data,
          ...(propOverrides?.hearing ? propOverrides.hearing : {}),
        },
      },
    },
    language: propOverrides?.language ?? mockHearingWithSections.data.language,
    user: {
      data: {
        ...(propOverrides?.user ?? {}),
      },
    },
  });

  const props = {
    hearing: mockHearingWithSections.data,
    sections: mockHearingWithSections.data.sections,
    activeLanguage: 'fi',
    dispatch: () => {},
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <Header intl={getIntlAsProp()} {...props} />
    </MemoryRouter>,
    {
      history,
      store: storeMock,
    },
  );
};

describe('<Header />', () => {
  it('should render correctly', () => {
    renderComponent();
  });

  it('should render timetable text correctly when hearing is published', async () => {
    renderComponent({
      hearing: {
        published: true,
        open_at: '2022-01-01',
        close_at: '2022-01-02',
      },
    });

    expect(await screen.findByText('timeOpenPast', { exact: false })).toBeInTheDocument();
    expect(await screen.findByText('timeClosePast', { exact: false })).toBeInTheDocument();
  });

  it('should render timetable text correctly when hearing is not published', async () => {
    renderComponent({
      hearing: {
        published: false,
        open_at: '2022-01-01',
        close_at: '2022-01-02',
      },
    });

    expect(await screen.findByText('draftNotPublished', { exact: false })).toBeInTheDocument();
  });

  it('should not return comments when hearing has no commentable sections', () => {
    renderComponent({
      hearing: {
        n_comments: 0,
        sections: [],
      },
    });

    expect(screen.queryByTestId('comment-summary')).not.toBeInTheDocument();
  });

  it('should return null when only one language is available', () => {
    renderComponent({
      language: 'fi',
      hearing: {
        title: {
          fi: 'Title in Finnish',
        },
      },
    });

    expect(screen.queryByTestId('language-select')).not.toBeInTheDocument();
  });

  it('should render language changer correctly when multiple languages are available', async () => {
    vi.spyOn(RouterMock, 'useLocation').mockImplementationOnce(() => ({
      pathname: '/hearing',
      search: '',
    }));

    renderComponent({
      language: 'en',
      hearing: {
        title: {
          fi: 'Title in Finnish',
          en: 'Title in English',
        },
      },
    });

    expect(await screen.findByTestId('language-select')).toBeInTheDocument();
  });

  it('should return null when user or user.favorite_hearings is not available', () => {
    renderComponent({
      user: null,
      hearing: {},
      addToFavorites: vi.fn(),
      removeFromFavorites: vi.fn(),
    });

    expect(screen.queryByText('addFavorites')).not.toBeInTheDocument();
  });

  it('should render favorite element correctly when hearing is not in user.favorite_hearings', async () => {
    renderComponent({
      user: {
        favorite_hearings: [],
      },
      hearing: {
        id: 'hearing1',
        slug: 'hearing-slug',
      },
      addToFavorites: vi.fn(),
      removeFromFavorites: vi.fn(),
    });

    expect(await screen.findByText('addFavorites')).toBeInTheDocument();
  });
});
