import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';

import { Home } from '../../src/views/Home';
import { getIntlAsProp, mockStore } from '../../test-utils';
import HearingCardList from '../../src/components/HearingCardList';
import FullWidthHearing from '../../src/components/FullWidthHearing';

// Renders the Hearings component using enzymes shallow rendering.
// You can pass props you want to override as a parameter.
const setup = (propOverrides) => {
  const {
    hearingLists: { allHearings },
    ...rest
  } = mockStore;
  const props = {
    topHearing: allHearings.data[0],
    openHearings: allHearings,
    ...rest,
    ...propOverrides,
  };

  const wrapper = shallow(
    <MemoryRouter>
      <Home intl={getIntlAsProp()} {...props} />
    </MemoryRouter>,
  );

  return {
    props,
    wrapper,
  };
};

test('Home component should render as expected', () => {
  const { wrapper } = setup();
  const tree = toJson(wrapper.dive().dive());
  expect(tree).toMatchSnapshot();
});

test('Should find top hearing', () => {
  const { wrapper } = setup();
  expect(
    wrapper
      .dive()
      .dive()
      .find(FullWidthHearing),
  ).toHaveLength(1);
});

test('Should find HearingCardList', () => {
  const { wrapper } = setup();
  expect(
    wrapper
      .dive()
      .dive()
      .find(HearingCardList),
  ).toHaveLength(1);
});
