import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {Hearings} from '../src/views/Hearings/index';
import {MemoryRouter} from 'react-router-dom';

test('Hearings component should render as expected', () => {
  const props = {
    intl: {
      formatMessage: () => 'translatedText',
    },
    dispatch: () => {},
    fetchLabels: () => {},
    match: {
      params: {
        tab: 'list'
      }
    },
    location: {
      search: ''
    },
    hearingLists: {
      allHearings: {
        data: []
      }
    },
    user: {}
  }

  const component = shallow(<MemoryRouter><Hearings {...props} /></MemoryRouter>).dive().dive();
  const tree = toJson(component);
  console.log(tree);
  expect(tree).toMatchSnapshot();
});