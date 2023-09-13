/* eslint-disable react/no-find-dom-node */
import {renderIntoDocument} from 'react-dom/test-utils';
import Comment, {UnconnectedComment} from '../src/components/Hearing/Comment';
import {findDOMNode} from 'react-dom';
import {wireComponent} from '../test-utils';
import React from 'react';
import {shallow} from 'enzyme';

const createCommentData = (props) => ({
  data: {
    "id": "f00f00",
    "hearing": "f00f00",
    "content": "Reiciendis",
    "n_votes": 2,
    "created_by": null,
    "created_at": "2015-11-16T09:25:37.625607Z",
    "answers": [],
    ...props
  }
});
const defaults = {
  data: createCommentData(),
};
describe('Comment', () => {
  function getWrapper(props) {
    return shallow(<UnconnectedComment {...defaults} {...props}/>);
  }

  describe('methods', () => {
    test('toggleMap toggles state.displayMap', () => {
      const wrapper = getWrapper();
      expect(wrapper.state('displayMap')).toBe(false);
      wrapper.instance().toggleMap();
      expect(wrapper.state('displayMap')).toBe(true);
      wrapper.instance().toggleMap();
      expect(wrapper.state('displayMap')).toBe(false);
    });
  });

  test('should be able to render an anonymous comment without crashing', () => {
    const anonComment = createCommentData();
    const comp = renderIntoDocument(wireComponent({}, Comment, anonComment));
    expect(findDOMNode(comp).className).toContain("hearing-comment");
  });

  test('should have a clickable voting thumb', () => {
    const anonComment = createCommentData();
    const comp = renderIntoDocument(wireComponent({}, Comment, anonComment));
    const voteBtn = findDOMNode(comp).getElementsByClassName("hearing-comment-votes")[0];
    expect(voteBtn.innerHTML).toContain("button");
  });

  describe('map', () => {
    describe('when comment contains geojson data', () => {
      const geojsonComment = createCommentData({"geojson": {coordinates: [11, 22], type: "Point"}});
      let wrapper;
      beforeEach(() => {
        wrapper = getWrapper(geojsonComment);
      });
      test('main wrapper for the map elements is rendered', () => {
        expect(wrapper.find('.hearing-comment__map')).toHaveLength(1);
      });
      test('a button to toggle the map is rendered', () => {
        expect(wrapper.find('.hearing-comment__map-toggle')).toHaveLength(1);
      });

      test('toggle button aria-expanded changes when button is pressed', () => {
        const buttonElement = wrapper.find('.hearing-comment__map-toggle');
        expect(wrapper.find('.hearing-comment__map-toggle').prop('aria-expanded')).toBe(false);
        buttonElement.simulate('click');
        expect(wrapper.find('.hearing-comment__map-toggle').prop('aria-expanded')).toBe(true);
        buttonElement.simulate('click');
        expect(wrapper.find('.hearing-comment__map-toggle').prop('aria-expanded')).toBe(false);
      });

      test('map container is not rendered by default(displayMap: false)', () => {
        expect(wrapper.find('.hearing-comment__map-container')).toHaveLength(0);
      });

      test('map container render changes when button is pressed', () => {
        // default - displayMap: false
        expect(wrapper.find('.hearing-comment__map-container')).toHaveLength(0);
        const buttonElement = wrapper.find('.hearing-comment__map-toggle');
        buttonElement.simulate('click'); // displayMap: false -> true
        expect(wrapper.find('.hearing-comment__map-container')).toHaveLength(1);
        buttonElement.simulate('click'); // displayMap: true -> false
        expect(wrapper.find('.hearing-comment__map-container')).toHaveLength(0);
      });
    });
    describe('when comment does not have geojson data', () => {
      test('main wrapper for the map elements is not rendered', () => {
        expect(getWrapper().find('.hearing-comment__map')).toHaveLength(0);
      });
    });
  });
});
