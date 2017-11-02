import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {Home} from '../src/views/Home';
import {getIntlAsProp} from '../test-utils';

test('Home component should render as expected', () => {
  const dispatch = () => {};
  const component = shallow(<Home intl={getIntlAsProp()} dispatch={dispatch} />);
  const tree = toJson(component);
  expect(tree).toMatchSnapshot();
});