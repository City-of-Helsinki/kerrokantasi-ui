import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {HearingView} from '../../src/views/Hearing/index';
import {MemoryRouter} from 'react-router-dom';
import {mockStore, getIntlAsProp} from '../../test-utils';

// Renders the Hearings component using enzymes shallow rendering.
// You can pass props you want to override as a parameter.
const setup = propOverrides => {
  const {labels, sectionComments, hearingLists: {allHearings}, hearing, dispatch} = mockStore;
  const props = Object.assign({
    labels: labels.data,
    hearing,
    hearingDraft: {},
    match: {
      params: {
        hearingSlug: allHearings.data[0].slug
      }
    },
    location: {
      pathname: '/' + allHearings.data[0].slug
    },
    sectionComments,
    dispatch
  }, propOverrides);

  const wrapper = shallow(<MemoryRouter><HearingView intl={getIntlAsProp()} {...props} /></MemoryRouter>);

  return {
    props,
    wrapper
  };
};

test('HearingView component should render as expected', () => {
  const {wrapper} = setup();
  const tree = toJson(wrapper.dive().dive());
  expect(tree).toMatchSnapshot();
});
