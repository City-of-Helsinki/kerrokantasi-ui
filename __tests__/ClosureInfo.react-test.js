import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {MemoryRouter} from 'react-router-dom';

import {ClosureInfo} from '../src/components/ClosureInfo';

// Renders the Hearings component using enzymes shallow rendering.
// You can pass props you want to override as a parameter.
const setup = propOverrides => {
  const props = {closureInfo: '<p>A very awesome closure info here.</p>', ...propOverrides};

  const wrapper = shallow(<MemoryRouter><ClosureInfo {...props} /></MemoryRouter>);

  return {
    props,
    wrapper
  };
};

test('ClosureInfo component should render as expected', () => {
  const {wrapper} = setup();
  const tree = toJson(wrapper.dive().dive());
  expect(tree).toMatchSnapshot();
});
