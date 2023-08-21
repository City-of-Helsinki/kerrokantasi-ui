import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { getIntlAsProp, mockStore } from '../../test-utils';
import HearingCard from '../../src/components/HearingCard';

// Renders the Hearings component using enzymes shallow rendering.
// You can pass props you want to override as a parameter.
const setup = propOverrides => {
  const { hearingLists: { allHearings } } = mockStore;
  const props = {
    hearing: allHearings.data[0],
    language: 'fi', ...propOverrides
  };

  const wrapper = shallow(<HearingCard intl={getIntlAsProp()} {...props} />);

  return {
    props,
    wrapper
  };
};

test('HearingCard component should render as expected', () => {
  const { wrapper } = setup();
  const tree = toJson(wrapper);
  expect(tree).toMatchSnapshot();
});
