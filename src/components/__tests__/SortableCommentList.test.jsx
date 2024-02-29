import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { SortableCommentListComponent } from '../SortableCommentList';
import { mockStore, getIntlAsProp } from '../../../test-utils';
import renderWithProviders from '../../utils/renderWithProviders';

const renderComponent = (propOverrides) => {
  const {
    sectionComments,
    hearingLists: { allHearings },
    mockHearingWithSections,
    dispatch,
  } = mockStore;

  const props = {
    hearingSlug: allHearings.data[0].slug,
    sectionComments: sectionComments.mock,
    dispatch,
    canVote: true,
    canComment: true,
    canSetNickname: true,
    displayVisualization: true,
    hearingId: mockHearingWithSections.data.id,
    section: mockHearingWithSections.data.sections[1],
    language: 'fi',
    published: true,
    fetchComments: () => {},
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <SortableCommentListComponent intl={getIntlAsProp()} {...props} />
    </MemoryRouter>,
  );
};

describe('<SortableCommentList />', () => {
  it('should render correctly', () => {
    renderComponent();
  });
});
