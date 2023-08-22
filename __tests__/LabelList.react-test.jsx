import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import { Labels } from '../src/components/LabelList';
import { getIntlAsProp } from '../test-utils';

test('LabelList can handle empty list', () => {
  const component = renderer.create(<Labels className='labels' store={{}} labels={[]} intl={getIntlAsProp()} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('LabelList can handle list of label objects', () => {
  const labels = [
    { id: 1, label: 'such' },
    { id: 2, label: 'label' },
  ];
  const component = shallow(
    <MemoryRouter>
      <Labels className='labels' labels={labels} intl={getIntlAsProp()} />
    </MemoryRouter>,
  );
  const tree = toJson(component.dive().dive());
  expect(tree).toMatchSnapshot();
});
