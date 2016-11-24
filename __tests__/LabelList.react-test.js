// LabelList.react-test.js
import React from 'react';
import LabelList from '../src/components/LabelList';
import renderer from 'react-test-renderer';


test('LabelList can handle list of label strings', () => {
  const labels = ["fancy", "test"];
  const component = renderer.create(
    <LabelList className="labels" labels={labels} />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});


test('LabelList can handle empty list', () => {
  const component = renderer.create(
    <LabelList className="labels" labels={[]} />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});


test('LabelList can handle list of label objects', () => {
  const labels = [
    {id: 1, label: "such"},
    {id: 2, label: "label"},
  ];
  const component = renderer.create(
    <LabelList className="labels" labels={labels} />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

