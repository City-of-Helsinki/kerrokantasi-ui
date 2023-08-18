import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

import {getIntlAsProp, mockStore} from '../../test-utils';
import HearingCardList from '../../src/components/HearingCardList';

// Renders the Hearings component using enzymes shallow rendering.
// You can pass props you want to override as a parameter.
const setup = propOverrides => {
  const {labels, hearingLists: {allHearings}, ...rest} = mockStore;
  const props = {hearings: allHearings.data,
    ...rest, ...propOverrides};

  const wrapper = shallow(<HearingCardList intl={getIntlAsProp()} {...props} />);

  return {
    props,
    wrapper
  };
};

test('HearingCardList component should render as expected', () => {
  const {wrapper} = setup();
  const tree = toJson(wrapper.dive());
  expect(tree).toMatchSnapshot();
});
