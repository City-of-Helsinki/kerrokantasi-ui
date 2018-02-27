import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {ContactListComponent} from '../../src/components/Hearing/Section/ContactList';
import {mockStore, getIntlAsProp} from '../../test-utils';

// Renders the Hearings component using enzymes shallow rendering.
// You can pass props you want to override as a parameter.
const setup = propOverrides => {
  const {mockHearingWithSections} = mockStore;
  const props = Object.assign({
    contacts: mockHearingWithSections.data.contacts,
    language: 'fi'
  }, propOverrides);

  const wrapper = shallow(<ContactListComponent {...props} />);

  return {
    props,
    wrapper
  };
};

test('ContactList component should render as expected', () => {
  const {wrapper} = setup();
  const tree = toJson(wrapper);
  expect(tree).toMatchSnapshot();
});
