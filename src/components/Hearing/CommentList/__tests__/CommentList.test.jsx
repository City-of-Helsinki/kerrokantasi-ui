import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { CommentList } from '..';
import { mockStore } from '../../../../../test-utils';
import renderWithProviders from '../../../../utils/renderWithProviders';

Math.random = jest.fn(() => 0.19859782441);

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
    </MemoryRouter>,
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
});
