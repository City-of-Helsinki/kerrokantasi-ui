import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';

import { HearingContainerComponent } from '../../src/views/Hearing/HearingContainer';
import { mockStore, getIntlAsProp } from '../../test-utils';

// Renders the Hearings component using enzymes shallow rendering.
// You can pass props you want to override as a parameter.
const setup = (propOverrides) => {
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

  const wrapper = shallow(
    <MemoryRouter>
      <HearingContainerComponent intl={getIntlAsProp()} {...props} />
    </MemoryRouter>,
  );

  return {
    props,
    wrapper,
  };
};

test('HearingContainer component should render as expected', () => {
  const { wrapper } = setup();
  const tree = toJson(wrapper.dive().dive());
  expect(tree).toMatchSnapshot();
});
