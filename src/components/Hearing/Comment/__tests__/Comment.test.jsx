import React from 'react';
import { screen, waitFor } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import userEvent from '@testing-library/user-event';

import { UnconnectedComment } from '..';
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
    questions: []
  },
});

jest.mock('../../../BaseCommentForm', () => () => <div data-testid="commentForm">CommentForm</div>)

const defaultProps = createCommentData();

const ARIA_EXPANDED = 'aria-expanded';

const renderComponent = (props) => renderWithProviders(<UnconnectedComment {...defaultProps} {...props} />);

describe('<Comment />', () => {
  it('should be able to render an anonymous comment without crashing', () => {
    const { getByText } = renderComponent();

    expect(getByText('Reiciendis')).toBeInTheDocument();
  });

  it('should have a clickable voting thumb', () => {
    const { getByRole } = renderComponent();

    expect(getByRole('button', { name: /voteButtonLikes/i })).toBeInTheDocument();
  });

  it('should toggle map visiblity', async () => {
    renderComponent();

    const toggleButton = await screen.findByRole('button', { name: 'commentShowMap' });

    expect(toggleButton.getAttribute(ARIA_EXPANDED)).toBe('false');

    const user = userEvent.setup();

    user.click(toggleButton);

    await waitFor(() => expect(toggleButton.getAttribute(ARIA_EXPANDED)).toBe('true'));
  });

  it('should toggle reply editor visibility', async () => {
    renderComponent({canReply: true});

    const replyButton = await screen.getByTestId('replyLink');

    const user = userEvent.setup();

    user.click(replyButton);

    await waitFor(() => expect(screen.getByTestId('commentForm')).toBeInTheDocument());
  });
});
