import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { HearingContainerComponent } from '../HearingContainer';
import { mockStore, getIntlAsProp } from '../../../../test-utils';
import renderWithProviders from '../../../utils/renderWithProviders';

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
      search: '',
    },
    sectionComments,
    fetchHearing: () => null,
    language: 'fi',
    user,
    isLoading: false,
    fetchEditorMetaData: () => null,
    fetchProjectsList: () => null,
    ...propOverrides,
  };

  return renderWithProviders(
    <MemoryRouter>
      <HearingContainerComponent intl={getIntlAsProp()} {...props} />
    </MemoryRouter>,
  );
};

describe('<HearingContainer />', () => {
  it('should render correctly', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
  });
});
