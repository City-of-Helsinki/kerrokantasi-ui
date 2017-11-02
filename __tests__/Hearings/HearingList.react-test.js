import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {HearingList} from '../../src/components/HearingList';
import {MemoryRouter} from 'react-router-dom';
import {mockStore, getIntlAsProp} from '../../test-utils';

test('HearingsList component should render as expected', () => {
  const props = {
    hearings: mockStore.hearingLists.allHearings.data,
    labels: mockStore.labels.data
  }
  const component = shallow(<MemoryRouter><HearingList intl={getIntlAsProp()} {...props} /></MemoryRouter>).dive().dive();
  const tree = toJson(component);
  expect(tree).toMatchSnapshot();
});
