import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import SectionImage from '../../src/components/Hearing/Section/SectionImage';
import {mockStore} from '../../test-utils';

// Renders the Hearings component using enzymes shallow rendering.
// You can pass props you want to override as a parameter.
const setup = propOverrides => {
  const {mockHearingWithSections} = mockStore;
  const props = Object.assign({
    image: mockHearingWithSections.data.sections[0].images[0],
    caption: 'Mock Von Caption',
    title: 'Amazing Title'
  }, propOverrides);

  const wrapper = shallow(<SectionImage {...props} />);

  return {
    props,
    wrapper
  };
};

test('SectionImage component should render as expected', () => {
  const {wrapper} = setup();
  const tree = toJson(wrapper);
  expect(tree).toMatchSnapshot();
});
