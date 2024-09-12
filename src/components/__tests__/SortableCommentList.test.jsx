import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { thunk } from 'redux-thunk';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SortableCommentListComponent from '../SortableCommentList';
import { mockStore as mockData, mockUser, getIntlAsProp } from '../../../test-utils';
import renderWithProviders from '../../utils/renderWithProviders';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

jest.mock('hds-react', () => {
  const actual = jest.requireActual('hds-react');

  return {
    ...actual,
    FileInput: jest.fn().mockImplementation(() => <div>FileInput</div>),
  };
});

const { sectionComments, mockHearingWithSections, dispatch } = mockData;

const storeDefaultState = {
  sectionComments: {
    [mockHearingWithSections.data.sections[0].id]: {
      ...sectionComments.mock,
      count: 0,
      results: [],
    },
  },
  user: { data: { ...mockUser } },
  language: 'fi',
  accessibility: {
    isHighContrast: false,
  },
};

const renderComponent = (propOverrides, storeOverriders) => {
  const props = {
    hearingSlug: mockHearingWithSections.data.slug,
    dispatch,
    canVote: true,
    canComment: true,
    canFlag: true,
    canSetNickname: true,
    displayVisualization: true,
    hearingId: mockHearingWithSections.data.id,
    section: {
      ...mockHearingWithSections.data.sections[0],
      questions: [],
    },
    published: true,
    fetchComments: jest.fn(),
    ...propOverrides,
  };

  const store = storeOverriders || mockStore(storeDefaultState);

  return renderWithProviders(
    <MemoryRouter>
      <SortableCommentListComponent intl={getIntlAsProp()} {...props} />
    </MemoryRouter>,
    { store },
  );
};

describe('<SortableCommentList />', () => {
  it('should render correctly', () => {
    renderComponent();
  });

  it('should handle comment posting', async () => {
    const onPostCommentMock = jest.fn();

    renderComponent({ onPostComment: onPostCommentMock });

    const user = userEvent.setup();

    const openFormButton = await screen.findByRole('button', { name: 'addComment' });

    await user.click(openFormButton);

    const textFields = await screen.findAllByRole('textbox');
    const commentField = textFields[0];

    await user.type(commentField, 'test');

    const submitForm = await screen.findByRole('button', { name: 'submit' });

    await user.click(submitForm);

    waitFor(() => expect(onPostCommentMock).toHaveBeenCalled());
  });

  it('should handle comment voting', async () => {
    const onPostVoteMock = jest.fn();

    const store = mockStore({
      ...storeDefaultState,
      sectionComments: {
        [mockHearingWithSections.data.sections[0].id]: {
          ...sectionComments.mock,
        },
      },
    });

    renderComponent({ onPostVote: onPostVoteMock }, store);

    const user = userEvent.setup();

    const voteForComment = await screen.findByRole('button', { name: /voteButtonLikes/i });

    await user.click(voteForComment);

    waitFor(() => expect(onPostVoteMock).toHaveBeenCalled());
  });

  it('should handle comment favorite', async () => {
    const onPostFlagMock = jest.fn();

    const store = mockStore({
      ...storeDefaultState,
      sectionComments: {
        [mockHearingWithSections.data.sections[0].id]: {
          ...sectionComments.mock,
        },
      },
    });

    renderComponent({ onPostFlag: onPostFlagMock }, store);

    const user = userEvent.setup();

    const flagComments = await screen.findAllByTestId('flag-comment');
    const firstFlag = flagComments[0];

    await user.click(firstFlag);

    waitFor(() => expect(onPostFlagMock).toHaveBeenCalled());
  });

  it('should sort comments', async () => {
    const fetchCommentsMock = jest.fn();

    const store = mockStore({
      ...storeDefaultState,
      sectionComments: {
        [mockHearingWithSections.data.sections[0].id]: {
          ...sectionComments.mock,
        },
      },
    });

    renderComponent({ fetchComments: fetchCommentsMock }, store);

    waitFor(() => expect(fetchCommentsMock).toHaveBeenCalledTimes(1));

    const user = userEvent.setup();

    const toggles = await screen.findAllByLabelText('commentOrder');
    const toggle = toggles[0];

    await user.click(toggle);

    waitFor(() => expect(fetchCommentsMock).toHaveBeenCalledTimes(1));

    const option = await screen.findByText('CREATED_AT_ASC');

    await user.click(option);

    waitFor(() => expect(fetchCommentsMock).toHaveBeenCalledTimes(2));
  });
});
