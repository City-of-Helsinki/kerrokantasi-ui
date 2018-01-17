import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import ContactCard from '../../src/components/ContactCard';
import {mockStore} from '../../test-utils';

// Renders the Hearings component using enzymes shallow rendering.
// You can pass props you want to override as a parameter.
const setup = propOverrides => {
  const {mockHearingWithSections} = mockStore;
  const props = Object.assign({
    ...mockHearingWithSections.data.contact_persons[0]
  }, propOverrides);

  const wrapper = shallow(<ContactCard {...props} />);

  return {
    props,
    wrapper
  };
};

test('ContactCard component should render as expected', () => {
  const {wrapper} = setup();
  const tree = toJson(wrapper);
  expect(tree).toMatchSnapshot();
});
