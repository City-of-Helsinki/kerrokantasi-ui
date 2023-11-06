import React from 'react';
import { shallow } from 'enzyme';
import AnchorLink from 'react-anchor-link-smooth-scroll';

import InternalLink from '../src/components/InternalLink';

describe('InternalLink', () => {
  const defaultProps = {
    destinationId: 'some-destination',
    srOnly: false,
  };

  function getWrapper(props) {
    return shallow(
      <InternalLink {...defaultProps} {...props}>
        <span>test link</span>
      </InternalLink>,
    );
  }

  describe('renders', () => {
    test('AnchorLink with correct default props', () => {
      const link = getWrapper().find(AnchorLink);
      expect(link).toHaveLength(1);
      const href = `#${defaultProps.destinationId}`;
      expect(link.prop('className')).toBe('internal-link');
      expect(link.prop('href')).toBe(href);
      expect(link.prop('children')).toEqual(<span>test link</span>);
    });

    test('AnchorLink with correct className when prop srOnly is true', () => {
      const link = getWrapper({ srOnly: true }).find(AnchorLink);
      expect(link).toHaveLength(1);
      expect(link.prop('className')).toBe('internal-link hidden-link');
    });
  });
});
