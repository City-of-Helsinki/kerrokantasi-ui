import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {HeaderComponent} from '../../src/components/Hearing/Header';
import {mockStore, getIntlAsProp} from '../../test-utils';

// Renders the Hearings component using enzymes shallow rendering.
// You can pass props you want to override as a parameter.
const setup = propOverrides => {
  const {mockHearingWithSections} = mockStore;
  const props = Object.assign({
    hearing: mockHearingWithSections.data,
    reportUrl: 'http://www.report.com',
    activeLanguage: 'fi',
    dispatch: () => {},
  }, propOverrides);

  const wrapper = shallow(<HeaderComponent intl={getIntlAsProp()} {...props} />);

  return {
    props,
    wrapper
  };
};

test('Header component should render as expected', () => {
  const {wrapper} = setup();
  const tree = toJson(wrapper);
  expect(tree).toMatchSnapshot();
});
