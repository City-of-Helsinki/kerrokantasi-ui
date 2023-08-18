import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';

import { getIntlAsProp, mockStore } from '../../test-utils';
import FullWidthHearing from '../../src/components/FullWidthHearing';

// Renders the Hearings component using enzymes shallow rendering.
// You can pass props you want to override as a parameter.
const setup = propOverrides => {
  const { hearingLists: { allHearings } } = mockStore;
  const props = {hearing: allHearings.data[0], ...propOverrides};

  const wrapper = shallow(<MemoryRouter><FullWidthHearing intl={getIntlAsProp()} {...props} /></MemoryRouter>);

  return {
    props,
    wrapper
  };
};

test('FullWidthHearing component should render as expected', () => {
  const { wrapper } = setup();
  const tree = toJson(wrapper.dive().dive());
  expect(tree).toMatchSnapshot();
});
