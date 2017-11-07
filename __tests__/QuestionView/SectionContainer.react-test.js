import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {SectionContainer} from '../../src/components/SectionContainer';
import {MemoryRouter} from 'react-router-dom';
import {mockStore, getIntlAsProp} from '../../test-utils';

// Renders the Hearings component using enzymes shallow rendering.
// You can pass props you want to override as a parameter.
const setup = propOverrides => {
  const {labels, sectionComments, hearingLists: {allHearings}, hearingWithSections, dispatch} = mockStore;
  const props = Object.assign({
    labels: labels.data,
    hearing: hearingWithSections.mockHearingWithSections.data,
    match: {
      params: {
        hearingSlug: allHearings.data[0].slug
      }
    },
    location: {
      pathname: '/' + allHearings.data[0].slug
    },
    hearingSlug: allHearings.data[0].slug,
    sectionId: hearingWithSections.mockHearingWithSections.data.sections[0].id,
    sectionComments,
    dispatch,
    section: hearingWithSections.mockHearingWithSections.data.sections[1]
  }, propOverrides);

  const wrapper = shallow(<MemoryRouter><SectionContainer intl={getIntlAsProp()} {...props} /></MemoryRouter>);

  return {
    props,
    wrapper
  };
};

test('SectionContainer component should render as expected', () => {
  const {wrapper} = setup();
  const tree = toJson(wrapper.dive().dive());
  expect(tree).toMatchSnapshot();
});
