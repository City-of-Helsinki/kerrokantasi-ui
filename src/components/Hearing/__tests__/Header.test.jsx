import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';

import { HeaderComponent } from '../Header';
import { mockStore, getIntlAsProp } from '../../../../test-utils';
import renderWithProviders from '../../../utils/renderWithProviders';

const renderComponent = (propOverrides) => {
  const { mockHearingWithSections } = mockStore;
  const props = {
    hearing: mockHearingWithSections.data,
    sections: mockHearingWithSections.data.sections,
    activeLanguage: 'fi',
    dispatch: () => {},
    location: {
      pathname: mockHearingWithSections.data.sections[0].id,
    },
    match: {
      params: {
        sectionId: mockHearingWithSections.data.sections[0].id,
      },
    },
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <HeaderComponent intl={getIntlAsProp()} {...props} />
    </MemoryRouter>,
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

    expect(await screen.findByText('timeOpenPast')).toBeInTheDocument();
    expect(await screen.findByText('timeClosePast')).toBeInTheDocument();
  });

  it('should render timetable text correctly when hearing is not published', async () => {
    renderComponent({
      hearing: {
        published: false,
        open_at: '2022-01-01',
        close_at: '2022-01-02',
      },
    });

    expect(await screen.findByText('draftNotPublished')).toBeInTheDocument();
  });

  it('should not return comments when hearing has no commentable sections', () => {
    renderComponent({
      hearing: {
        n_comments: 0,
      },
      sections: [],
      section: null,
      user: null,
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
      location: {
        pathname: '/hearing',
        search: '',
      },
    });

    expect(screen.queryByTestId('language-select')).not.toBeInTheDocument();
  });

  it('should render language changer correctly when multiple languages are available', async () => {
    renderComponent({
      language: 'en',
      hearing: {
        title: {
          fi: 'Title in Finnish',
          en: 'Title in English',
        },
      },
      location: {
        pathname: '/hearing',
        search: '',
      },
    });

    expect(await screen.findByTestId('language-select')).toBeInTheDocument();
  });

  it('should return null when user or user.favorite_hearings is not available', () => {
    renderComponent({
      user: null,
      hearing: {},
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
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
      addToFavorites: jest.fn(),
      removeFromFavorites: jest.fn(),
    });

    expect(await screen.findByText('addFavorites')).toBeInTheDocument();
  });
});
