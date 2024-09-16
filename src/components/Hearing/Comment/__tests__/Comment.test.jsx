import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDispatch } from 'react-redux';

import Comment from '..';
import renderWithProviders from '../../../../utils/renderWithProviders';

const createCommentData = (props) => ({
  data: {
    id: 'f00f00',
    hearing: 'f00f00',
    content: 'Reiciendis',
    n_votes: 2,
    created_by: null,
    created_at: '2015-11-16T09:25:37.625607Z',
    answers: [],
    geojson: { coordinates: [11, 22], type: 'Point' },
    ...props,
  },
  section: {
    questions: [],
  },
});
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock('../../../BaseCommentForm', () => () => <div data-testid='commentForm'>CommentForm</div>);

jest.mock('../../../BaseCommentForm', () => () => <div data-testid='commentForm'>CommentForm</div>);

const defaultProps = createCommentData();

const ARIA_EXPANDED = 'aria-expanded';

const renderComponent = (props) => renderWithProviders(<Comment {...defaultProps} {...props} />);

describe('<Comment />', () => {
  it('should be able to render an anonymous comment without crashing', () => {
    const { getByText } = renderComponent();

    expect(getByText('Reiciendis')).toBeInTheDocument();
  });

  it('should vote comments', async () => {
    const onPostVoteMock = jest.fn();

    renderComponent({ canVote: true, onPostVote: onPostVoteMock });

    const user = userEvent.setup();

    const buttons = await screen.findAllByRole('button', { name: /voteButtonLikes/i });
    const firstButton = buttons[0];

    await user.click(firstButton);

    expect(onPostVoteMock).toHaveBeenCalled();
  });

  it('should flag comments', async () => {
    const onPostFlagMock = jest.fn();

    renderComponent({ canFlag: true, onPostFlag: onPostFlagMock, user: {} });

    const user = userEvent.setup();

    const buttons = await screen.findAllByTestId('flag-comment');
    const firstButton = buttons[0];

    await user.click(firstButton);

    expect(onPostFlagMock).toHaveBeenCalled();
  });

  it('should toggle map visiblity', async () => {
    renderComponent();

    const toggleButton = await screen.findByRole('button', { name: 'commentShowMap' });

    expect(toggleButton.getAttribute(ARIA_EXPANDED)).toBe('false');

    const user = userEvent.setup();

    user.click(toggleButton);

    await waitFor(() => expect(toggleButton.getAttribute(ARIA_EXPANDED)).toBe('true'));
  });

  it('should have edit links open if canReply is true', async () => {
    renderComponent({ canReply: true });

    await waitFor(() => expect(screen.getByTestId('replyLink')).toBeInTheDocument());
  });

  it('should toggle reply editor visibility', async () => {
    renderComponent({ canReply: true });

    const replyButton = await screen.getByTestId('replyLink');

    const user = userEvent.setup();

    user.click(replyButton);

    await waitFor(() => expect(screen.getByTestId('commentForm')).toBeInTheDocument());
  });

  it('should show proper delete message if comment was deleted by user', async () => {
    const props = createCommentData({
      deleted: true,
      deleted_by_type: 'self',
      edited: true,
    });
    renderComponent(props);
    await waitFor(() => expect(screen.getByText('sectionCommentSelfDeletedMessage')).toBeInTheDocument());
  });

  it('should show proper delete message if comment was deleted by user', async () => {
    const props = createCommentData({
      deleted: true,
      deleted_by_type: 'moderator',
      edited: true,
    });
    renderComponent(props);
    await waitFor(() => expect(screen.getByText('sectionCommentDeletedMessage')).toBeInTheDocument());
  });

  it('should show edit link for user that can edit', async () => {
    const handleSubmitFn = jest.fn();
    const props = createCommentData({
      can_edit: true,
      deleted: false,
    });
    props.onEditComment = handleSubmitFn;
    renderComponent(props);

    const user = userEvent.setup();

    const editButton = screen.getByText('edit');

    user.click(editButton);

    await waitFor(() => expect(screen.getByTestId('editorForm')).toBeInTheDocument());

    const submitButton = screen.getByText('save');

    user.click(submitButton);

    await waitFor(() => expect(handleSubmitFn).toHaveBeenCalledTimes(1));
  });

  it('should show delete link for user that can delete', async () => {
    const deleteCommentFn = jest.fn();
    const props = createCommentData({
      can_edit: true,
      can_delete: true,
      deleted: false,
    });

    props.onDeleteComment = deleteCommentFn;
    renderComponent(props);

    const user = userEvent.setup();

    const deleteButton = screen.getByText('delete');

    user.click(deleteButton);

    await waitFor(() => expect(deleteCommentFn).toHaveBeenCalledTimes(1));
  });

  it('should handle voting correctly', async () => {
    const onPostVote = jest.fn();
    const props = createCommentData({
      canVote: true,
    });
    props.onPostVote = onPostVote;

    const dispatch = jest.fn();
    useDispatch.mockReturnValue(dispatch);

    renderComponent(props);

    const voteButton = screen.getByRole('button', { name: /voteButtonLikes/i });

    const user = userEvent.setup();

    user.click(voteButton);

    await waitFor(() => expect(dispatch).toHaveBeenCalledTimes(1));
  });
});
