import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MemoryRouter } from 'react-router-dom';

import { Hearings } from '../../src/views/Hearings/index';
import { HearingList } from '../../src/components/HearingList';
import { mockStore, getIntlAsProp } from '../../test-utils';

// Renders the Hearings component using enzymes shallow rendering.
// You can pass props you want to override as a parameter.
const setup = (propOverrides) => {
  const { labels, ...rest } = mockStore;
  const props = {
    labels: labels.data,
    ...rest,
    ...propOverrides,
  };

  const wrapper = shallow(
    <MemoryRouter>
      <Hearings intl={getIntlAsProp()} {...props} />
    </MemoryRouter>,
  );

  return {
    props,
    wrapper,
  };
};

test('Hearings component should render as expected', () => {
  const { wrapper } = setup();
  const tree = toJson(wrapper.dive().dive());
  expect(tree).toMatchSnapshot();
});

test('Hearings component will render HearingList when labels are present', () => {
  const { wrapper } = setup();
  expect(
    wrapper
      .dive()
      .dive()
      .find(HearingList),
  ).toHaveLength(1);
});
