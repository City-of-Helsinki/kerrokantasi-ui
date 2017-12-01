import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {Section} from '../../src/components/Section';
import {MemoryRouter} from 'react-router-dom';
import {mockStore, getIntlAsProp} from '../../test-utils';

// Renders the Hearings component using enzymes shallow rendering.
// You can pass props you want to override as a parameter.
const setup = propOverrides => {
  const {sectionComments, hearingLists: {allHearings}, hearingWithSections, dispatch} = mockStore;
  const props = Object.assign({
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
    comments: sectionComments,
    dispatch,
    isCollapsible: false,
    canVote: true,
    canComment: true,
    section: hearingWithSections.mockHearingWithSections.data.sections[0],
    language: 'fi',
    sectionNav: {
      shouldShowBrowser: true
    }
  }, propOverrides);

  const wrapper = shallow(<MemoryRouter><Section intl={getIntlAsProp()} {...props} /></MemoryRouter>);

  return {
    props,
    wrapper
  };
};

test('Section component should render as expected', () => {
  const {wrapper} = setup();
  const tree = toJson(wrapper.dive().dive());
  expect(tree).toMatchSnapshot();
});
