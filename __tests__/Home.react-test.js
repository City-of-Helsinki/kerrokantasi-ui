import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {Home} from '../src/views/Home';

test('Home component should render as expected', () => {
  const intl = {
    formatMessage: () => 'translatedText',
  }
  const dispatch = () => {};
  const component = shallow(<Home intl={intl} dispatch={dispatch} />);
  const tree = toJson(component);
  console.log(tree);
  expect(tree).toMatchSnapshot();
});