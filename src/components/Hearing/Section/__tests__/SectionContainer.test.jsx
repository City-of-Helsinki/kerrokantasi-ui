import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import SectionContainerComponent from '../SectionContainer';
import { mockStore, getIntlAsProp } from '../../../../../test-utils';
import renderWithProviders from '../../../../utils/renderWithProviders';

const renderComponent = (propOverrides) => {
  const {
    labels,
    sectionComments,
    hearingLists: { allHearings },
    mockHearingWithSections,
    user,
  } = mockStore;

  const props = {
    labels: labels.data,
    hearing: mockHearingWithSections.data,
    hearingDraft: {},
    match: {
      params: {
        hearingSlug: allHearings.data[0].slug,
      },
    },
    location: {
      pathname: `/${allHearings.data[0].slug}`,
    },
    sectionComments,
    showClosureInfo: true,
    sections: mockHearingWithSections.data.sections,
    language: 'fi',
    contacts: mockHearingWithSections.data.contacts,
    user,
    fetchCommentsForSortableList: jest.fn(),
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <SectionContainerComponent intl={getIntlAsProp()} {...props} />
    </MemoryRouter>,
  );
};

describe('<SectionContainer />', () => {
  it('should render correctly', () => {
    renderComponent();
  });
});
