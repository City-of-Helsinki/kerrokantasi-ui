import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {SortableCommentListComponent} from '../src/components/SortableCommentList';
import {MemoryRouter} from 'react-router-dom';
import {mockStore, getIntlAsProp} from '../test-utils';

// Renders the Hearings component using enzymes shallow rendering.
// You can pass props you want to override as a parameter.
const setup = propOverrides => {
  const {sectionComments, hearingLists: {allHearings}, mockHearingWithSections, dispatch} = mockStore;
  const props = Object.assign({
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
    fetchComments: () => {}
  }, propOverrides);

  const wrapper = shallow(<MemoryRouter><SortableCommentListComponent intl={getIntlAsProp()} {...props} /></MemoryRouter>);

  return {
    props,
    wrapper
  };
};

test('SortableCommentList component should render as expected', () => {
  const {wrapper} = setup();
  const tree = toJson(wrapper.dive().dive());
  expect(tree).toMatchSnapshot();
});
