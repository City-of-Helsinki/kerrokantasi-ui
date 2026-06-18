import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import CommentList from '..';
import { mockStore } from '../../../../../test-utils';
import renderWithProviders from '../../../../utils/renderWithProviders';

Math.random = vi.fn(() => 0.19859782441);

vi.mock('../../Comment', () => ({
  default: ({ data, showReplies }) => (
    <li
      data-testid='comment-stub'
      data-comment-id={data.id}
      data-show-replies={String(showReplies)}
    />
  ),
}));

const makeComment = (overrides = {}) => ({
  id: 1,
  content: 'A comment',
  author_name: 'Tester',
  n_votes: 0,
  created_at: '2017-10-23T11:23:47.475069Z',
  subComments: [],
  comments: [],
  ...overrides,
});

const renderComponent = (propOverrides) => {
  const { sectionComments, dispatch, hearing } = mockStore;
  const props = {
    comments: sectionComments.mock.results,
    dispatch,
    canComment: true,
    isLoading: false,
    section: hearing.mockHearing.data.sections[0],
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <CommentList {...props} />
    </MemoryRouter>
  );
};

describe('<CommentList />', () => {
  it('should render as expected', () => {
    renderComponent();
  });

  it('should render a message if no comments were found', () => {
    const { getByText } = renderComponent({ comments: [] });

    expect(getByText('noCommentsAvailable')).toBeInTheDocument();
  });

  it('renders nothing when comments are empty and canComment is false', () => {
    const { container } = renderComponent({ comments: [], canComment: false });

    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when comments are empty and isLoading is true', () => {
    const { container } = renderComponent({
      comments: [],
      canComment: true,
      isLoading: true,
    });

    expect(container.firstChild).toBeNull();
  });

  it('renders one Comment per comment in the array', () => {
    const comments = [
      makeComment({ id: 1 }),
      makeComment({ id: 2 }),
      makeComment({ id: 3 }),
    ];
    const { getAllByTestId } = renderComponent({ comments });

    expect(getAllByTestId('comment-stub')).toHaveLength(3);
  });

  it('initializes commentShowReplies to false for each comment', () => {
    const comments = [
      makeComment({ id: 1 }),
      makeComment({ id: 2 }),
      makeComment({ id: 3 }),
    ];
    const { getAllByTestId } = renderComponent({ comments });
    const stubs = getAllByTestId('comment-stub');

    stubs.forEach((stub) => {
      expect(stub.getAttribute('data-show-replies')).toBe('false');
    });
  });

  it('renders additional comments when the comments array grows', () => {
    const initialComments = [makeComment({ id: 1 })];
    const { rerender, getAllByTestId } = renderComponent({
      comments: initialComments,
    });

    expect(getAllByTestId('comment-stub')).toHaveLength(1);

    const updatedComments = [
      makeComment({ id: 1 }),
      makeComment({ id: 2 }),
      makeComment({ id: 3 }),
    ];
    rerender(
      <MemoryRouter>
        <CommentList
          comments={updatedComments}
          canComment
          isLoading={false}
          section={mockStore.hearing.mockHearing.data.sections[0]}
        />
      </MemoryRouter>
    );

    expect(getAllByTestId('comment-stub')).toHaveLength(3);
  });

  it('keeps rendering correctly when section.id changes', () => {
    const comments = [makeComment({ id: 1 }), makeComment({ id: 2 })];
    const { rerender, getAllByTestId } = renderComponent({ comments });

    expect(getAllByTestId('comment-stub')).toHaveLength(2);

    rerender(
      <MemoryRouter>
        <CommentList
          comments={comments}
          canComment
          isLoading={false}
          section={{
            ...mockStore.hearing.mockHearing.data.sections[0],
            id: 'different-section-id',
          }}
        />
      </MemoryRouter>
    );

    expect(getAllByTestId('comment-stub')).toHaveLength(2);
  });
});
