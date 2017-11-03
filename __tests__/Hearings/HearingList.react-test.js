import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {HearingList, HearingListItem} from '../../src/components/HearingList';
import {MemoryRouter} from 'react-router-dom';
import {mockStore, getIntlAsProp} from '../../test-utils';

// Renders the HearingList component using enzymes shallow rendering.
// You can pass props you want to override as a parameter.
const setup = propOverrides => {
  const {labels, hearingLists} = mockStore;
  const props = Object.assign({
    labels: labels.data,
    hearings: hearingLists.allHearings.data
  }, propOverrides);

  const wrapper = shallow(<MemoryRouter><HearingList intl={getIntlAsProp()} {...props} /></MemoryRouter>);

  return {
    props,
    wrapper
  };
};

test('HearingsList component should render as expected', () => {
  const {wrapper} = setup();
  const tree = toJson(wrapper.dive().dive());
  expect(tree).toMatchSnapshot();
});

test('Should render one HearingListItem', () => {
  const {wrapper} = setup();
  expect(wrapper.dive().dive().find(HearingListItem)).toHaveLength(1);
});

test('Should render noHearings message if hearings is an empty array', () => {
  const {wrapper} = setup({hearings: []});
  expect(wrapper.dive().dive().find('#noHearings')).toHaveLength(1);
});
