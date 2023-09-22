import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';

import { SectionContainerComponent } from '../../src/components/Hearing/Section/SectionContainer';
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
    },
    sectionComments,
    showClosureInfo: true,
    sections: mockHearingWithSections.data.sections,
    language: 'fi',
    contacts: mockHearingWithSections.data.contacts,
    user,
    ...propOverrides,
  };

  const wrapper = shallow(
    <MemoryRouter>
      <SectionContainerComponent intl={getIntlAsProp()} {...props} />
    </MemoryRouter>,
  );

  return {
    props,
    wrapper,
  };
};

test('SectionContainer component should render as expected', () => {
  const { wrapper } = setup();
  const tree = toJson(wrapper.dive().dive());
  expect(tree).toMatchSnapshot();
});
