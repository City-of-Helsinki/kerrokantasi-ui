import React from 'react';
import { shallow } from 'enzyme';

import IframeEntity from '../../../src/components/RichTextEditor/Iframe/IframeEntity';

describe('IframeEntity', () => {
  const entity = {
    data: {
      title: "some title",
      src: "https://google.fi"
    },
    entityKey: "IFRAME",
    getData() { return this.data; },
  };

  const contentState = { getEntity: () => entity };

  const defaultProps = {
    contentState,
    entityKey: 'IFRAME',
  };

  function getWrapper(props) {
    return shallow(<IframeEntity {...defaultProps} {...props} />);
  }
  test('renders with correct props', () => {
    const wrapper = getWrapper();
    expect(wrapper.prop('style')).toEqual({ overflow: "hidden" });
    const iframe = wrapper.find('iframe');
    expect(iframe).toHaveLength(1);
    const { title, src } = defaultProps.contentState.getEntity().getData();
    expect(iframe.prop('title')).toBe(title);
    expect(iframe.prop('src')).toBe(src);
  });
});

