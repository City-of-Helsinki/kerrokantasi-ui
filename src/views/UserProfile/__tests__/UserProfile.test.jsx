import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { UnconnectedUserProfile } from '..';
import { getIntlAsProp } from '../../../../test-utils';
import renderWithProviders from '../../../utils/renderWithProviders';

const createUniqueHearing = (id, slug, title, count, closed, ...props) => ({
  id,
  commentCount: count,
  data: {
    slug,
    title: {
      fi: title,
    },
    closed,
  },
  created_at: '2015-11-16T09:25:37.625607Z',
  ...props,
});
const defaultUniqueHearings = [
  createUniqueHearing('hearingOne', 'slugOne', 'this str contains a full stop so it will be cut.'.repeat(3), 1, true),
  createUniqueHearing(
    'hearingTwo',
    'slugTwo',
    'FILLER LOREM IPSUM FILLER. this contains a date near the end so it is sliced 12.12.2020. LOREM IPSUM FILLER.',
    2,
    false,
  ),
  createUniqueHearing('hearingThree', 'slugThree', 'this is 88 characters.'.repeat(4), 3, false),
  createUniqueHearing(
    'hearingFour',
    'slugFour',
    'this is supposed to be a title that is over 100 characters.'.repeat(2),
    1,
    false,
  ),
];
const createComment = (id, hearing, content, ...props) => ({
  id,
  hearing,
  content,
  n_votes: 0,
  created_by: null,
  created_at: '2021-11-16T09:25:37.625607Z',
  answers: [],
  hearing_data: {
    closed: false,
  },
  ...props,
});

const defaultComments = [
  createComment('1', 'hearingOne', 'first comment'),
  createComment('2', 'hearingTwo', 'second comment'),
  createComment('3', 'hearingTwo', 'third comment'),
  createComment('4', 'hearingThree', 'fourth comment'),
  createComment('5', 'hearingThree', 'fifth comment'),
  createComment('6', 'hearingThree', 'sixth comment'),
  createComment('7', 'hearingFour', 'seventh comment'),
];

const renderComponent = (propOverrides) => {
  const props = {
    intl: getIntlAsProp(),
    fetchComments: jest.fn(),
    fetchFavorites: jest.fn(),
    removeFromFavorites: jest.fn(),
    user: { favorite_hearings: ['hearingOne', 'someOtherHearing'] },
    userState: {
      userExists: true,
      userLoading: false,
    },
    profile: {
      comments: {
        count: defaultComments.length,
        results: defaultComments,
        uniqueHearings: defaultUniqueHearings,
      },
      favoriteHearings: {
        count: 2,
        results: [
          { id: 'firstFavoriteHearing', title: 'firstFavoriteHearing' },
          { id: 'secondFavoriteHearing', title: 'secondFavoriteHearing' },
        ],
      },
    },
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <UnconnectedUserProfile {...props} />
    </MemoryRouter>,
  );
};

describe('<UserProfile />', () => {
  it('should render correctly', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
  });

  it('should fetchComments and fetchFavorites if userExists && user', () => {
    const fetchCommentsMock = jest.fn();
    const fetchFavoritesMock = jest.fn();

    renderComponent({ fetchComments: fetchCommentsMock, fetchFavorites: fetchFavoritesMock });

    expect(fetchCommentsMock).toHaveBeenCalledTimes(1);
    expect(fetchFavoritesMock).toHaveBeenCalledTimes(1);
    expect(fetchFavoritesMock).toHaveBeenCalledWith({ following: true });
  });

  it('should not fetchComments and fetchFavorites if userExists && user is false', () => {
    const fetchCommentsMock = jest.fn();
    const fetchFavoritesMock = jest.fn();

    renderComponent({ fetchComments: fetchCommentsMock, fetchFavorites: fetchFavoritesMock, user: null });

    expect(fetchCommentsMock).not.toHaveBeenCalled();
    expect(fetchFavoritesMock).not.toHaveBeenCalled();
  });

  it('should not fetchComments & fetchFavorites if userLoading', async () => {
    const fetchCommentsMock = jest.fn();
    const fetchFavoritesMock = jest.fn();

    renderComponent({
      fetchComments: fetchCommentsMock,
      fetchFavorites: fetchFavoritesMock,
      user: null,
      userState: { userLoading: true },
    });

    expect(await screen.findByTestId('load-spinner')).toBeInTheDocument();

    expect(fetchCommentsMock).not.toHaveBeenCalled();
    expect(fetchFavoritesMock).not.toHaveBeenCalled();
  });

  it('should have correct amount of options', async () => {
    renderComponent();

    const select = await screen.findByTestId('hearing-select');

    expect(select.children).toHaveLength(defaultUniqueHearings.length + 1);
  });

  it('should select hearing', async () => {
    renderComponent();

    const select = await screen.findByTestId('hearing-select');
    const option = await screen.findByRole('option', { name: /this contains a date near the end/i });

    const user = userEvent.setup();

    await user.selectOptions(select, option);

    expect(option.selected).toBe(true);
  });
});
