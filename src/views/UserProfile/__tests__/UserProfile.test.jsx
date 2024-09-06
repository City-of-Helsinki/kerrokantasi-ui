/* eslint-disable sonarjs/no-duplicate-string */
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';

import UserProfile from '..';
import { getIntlAsProp } from '../../../../test-utils';
import renderWithProviders from '../../../utils/renderWithProviders';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock('../../../api', () => ({
  get: jest.fn().mockResolvedValue({ ok: true, json: () => ({}) }),
  post: jest.fn().mockResolvedValue({ ok: true, json: () => ({}) }),
}));

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

const createComment = (id, slug, title, hearing, content, ...props) => ({
  id,
  hearing,
  content,
  n_votes: 0,
  created_by: null,
  created_at: '2021-11-16T09:25:37.625607Z',
  answers: [],
  hearing_data: {
    slug,
    title: {
      fi: title,
    },
    closed: false,
  },
  ...props,
});

const defaultComments = [
  createComment('1', 'slugOne', 'this str contains a full stop so it will be cut.'.repeat(3), 'first comment'),
  createComment(
    '2',
    'slugTwo',
    'FILLER LOREM IPSUM FILLER. this contains a date near the end so it is sliced 12.12.2020. LOREM IPSUM FILLER.',
    'second comment',
  ),
  createComment(
    '3',
    'slugTwo',
    'FILLER LOREM IPSUM FILLER. this contains a date near the end so it is sliced 12.12.2020. LOREM IPSUM FILLER.',
    'third comment',
  ),
  createComment('4', 'slugThree', 'this is 88 characters.'.repeat(4), 'fourth comment'),
  createComment('5', 'slugThree', 'this is 88 characters.'.repeat(4), 'fifth comment'),
  createComment('6', 'slugThree', 'this is 88 characters.'.repeat(4), 'sixth comment'),
  createComment(
    '7',
    'slugFour',
    'this is supposed to be a title that is over 100 characters.'.repeat(2),
    'seventh comment',
  ),
];

const defaultState = {
  user: {
    data: {
      favorite_hearings: ['hearingOne'],
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
          { id: 'hearingOne', slug: 'slugOne', title: 'this str contains a full stop so it will be cut.'.repeat(3) },
        ],
      },
    },
  },
  oidc: { isLoadingUser: false, user: {} },
  userState: {
    userExists: true,
    userLoading: false,
  },
};

const renderComponent = (storeOverride = false) => {
  const props = {
    intl: getIntlAsProp(),
    fetchComments: jest.fn(),
    fetchFavorites: jest.fn(),
    removeFromFavorites: jest.fn(),
  };

  const store = storeOverride || mockStore(defaultState);

  return renderWithProviders(
    <BrowserRouter>
      <UserProfile {...props} />
    </BrowserRouter>,
    { store },
  );
};

describe('<UserProfile />', () => {
  it('should render correctly', () => {
    renderComponent();
  });

  it('should fetchComments and fetchFavorites if userExists && user', () => {
    const store = mockStore(defaultState);

    renderComponent(store);

    const expected = [{ type: 'beginFetchUserComments' }, { type: 'beginFetchFavoriteHearings' }];

    expect(store.getActions()).toEqual(expected);
  });

  it('should not fetchComments and fetchFavorites if userExists && user is false', () => {
    const store = mockStore({ ...defaultState, user: { ...defaultState.user, data: null } });

    renderComponent(store);

    expect(store.getActions()).toEqual([]);
  });

  it('should not fetchComments & fetchFavorites if userLoading', async () => {
    const store = mockStore({
      ...defaultState,
      user: { ...defaultState.user, data: null },
      userState: { userExists: false, userLoading: true },
    });

    renderComponent(store);

    expect(await screen.findByTestId('load-spinner')).toBeInTheDocument();

    expect(store.getActions()).toEqual([]);
  });

  it('should have correct amount of options', async () => {
    renderComponent();

    const user = userEvent.setup();

    const controls = await screen.findByTestId('hearing-selects');
    const buttons = await within(controls).findAllByRole('button');
    const toggle = buttons[0];

    const select = toggle.nextSibling;

    await user.click(toggle);

    expect(select.children).toHaveLength(8);
  });

  it('should select hearing', async () => {
    renderComponent();

    const user = userEvent.setup();

    const controls = await screen.findByTestId('hearing-selects');
    const buttons = await within(controls).findAllByRole('button');
    const toggle = buttons[0];
    const select = toggle.nextSibling;

    await user.click(toggle);

    await user.click(select.children[2]);

    const commentList = await screen.findByTestId('commentlist');

    expect(commentList.children).toHaveLength(1);
  });

  it('should change order', async () => {
    renderComponent();

    const user = userEvent.setup();

    const controls = await screen.findByTestId('hearing-selects');
    const buttons = await within(controls).findAllByRole('button');
    const toggle = buttons[1];
    const select = toggle.nextSibling;

    const commentList = await screen.findByTestId('commentlist');

    expect(commentList.children).toHaveLength(7);

    await user.click(toggle);
    await user.click(select.children[1]);

    expect(commentList.children).toHaveLength(7);
  });

  it('should render no content found', async () => {
    const store = mockStore({
      ...defaultState,
      user: {
        ...defaultState.user,
        profile: {
          ...defaultState.user.profile,
          favoriteHearings: {
            count: 0,
            results: [],
          },
        },
      },
    });

    renderComponent(store);

    expect(screen.queryByText('noFavoriteHearings')).toBeInTheDocument();
  });

  it('should remove from favorites', async () => {
    const store = mockStore(defaultState);

    renderComponent(store);

    const user = userEvent.setup();

    const hearingCards = await screen.findByTestId('hearing-card-list');

    expect(hearingCards.children).toHaveLength(1);

    const removeFromFavorites = await within(hearingCards.children[0]).findByRole('button');

    await user.click(removeFromFavorites);

    const expected = [
      { type: 'beginFetchUserComments' },
      { type: 'beginFetchFavoriteHearings' },
      { type: 'receiveUserComments', payload: { data: {} } },
      { type: 'receiveFavoriteHearings', payload: { data: {} } },
      { type: 'beginRemoveHearingFromFavorites', payload: { hearingSlug: 'slugOne' } },
    ];

    expect(store.getActions()).toEqual(expected);
  });
});
