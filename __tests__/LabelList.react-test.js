// LabelList.react-test.js
import React from 'react';
import LabelList from '../src/components/LabelList';
import renderer from 'react-test-renderer';
import {MemoryRouter} from 'react-router-dom';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';

test('LabelList can handle empty list', () => {
  const component = renderer.create(
    <LabelList className="labels" store={{}} labels={[]} />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});


test('LabelList can handle list of label objects', () => {
  const labels = [
    {id: 1, label: "such"},
    {id: 2, label: "label"},
  ];
  const component = shallow(
    <MemoryRouter><LabelList className="labels" labels={labels} /></MemoryRouter>
  );
  const tree = toJson(component.dive().dive());
  expect(tree).toMatchSnapshot();
});
