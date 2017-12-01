import React from 'react';
import {shallow} from 'enzyme';
import toJson from 'enzyme-to-json';
import {SectionCarousel} from '../src/components/Carousel';
import {MemoryRouter} from 'react-router-dom';
import {mockStore} from '../test-utils';

// Renders the Hearings component using enzymes shallow rendering.
// You can pass props you want to override as a parameter.
const setup = propOverrides => {
  const {hearingWithSections} = mockStore;
  const props = Object.assign({
    hearing: hearingWithSections.mockHearingWithSections.data,
    match: {
      params: {
        sectionId: 'asuminen-a-asuinalueiden-elinvoi'
      }
    },
    language: 'fi'
  }, propOverrides);
  console.log(props.hearing)

  const wrapper = shallow(<MemoryRouter><SectionCarousel {...props} /></MemoryRouter>);

  return {
    props,
    wrapper
  };
};

test('Carousel component should render as expected', () => {
  const {wrapper} = setup();
  const tree = toJson(wrapper.dive().dive());
  expect(tree).toMatchSnapshot();
});
