import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {CommentList} from '../src/components/CommentList';
import {MemoryRouter} from 'react-router-dom';
import {mockStore, getIntlAsProp} from '../test-utils';

// Renders the Hearings component using enzymes shallow rendering.
// You can pass props you want to override as a parameter.
const setup = propOverrides => {
  const {sectionComments, dispatch, hearing} = mockStore;
  const props = Object.assign({
    comments: sectionComments.mock.results,
    dispatch,
    canComment: true,
    isLoading: false,
    section: hearing.mockHearing.data.sections[0]
  }, propOverrides);

  const wrapper = shallow(<MemoryRouter><CommentList intl={getIntlAsProp()} {...props} /></MemoryRouter>);

  return {
    props,
    wrapper
  };
};

Math.random = jest.fn(() => 0.19859782441);

test('CommentList component should render as expected', () => {
  const {wrapper} = setup();
  const tree = toJson(wrapper.dive().dive());
  expect(tree).toMatchSnapshot();
});

test('CommentList should render a message if no comments were found', () => {
  const {wrapper} = setup({comments: []});
  const tree = toJson(wrapper.dive().dive());
  expect(tree).toMatchSnapshot();
});
