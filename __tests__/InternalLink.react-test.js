import React from "react";
import {shallow} from "enzyme";
import { HashLink } from "react-router-hash-link";

import InternalLink from "../src/components/InternalLink";

describe('InternalLink', () => {
  const defaultProps = {
    destinationId: 'some-destination',
    srOnly: false,
  };

  function getWrapper(props) {
    return (shallow(<InternalLink {...defaultProps} {...props} ><span>test link</span></InternalLink>));
  }

  describe('renders', () => {
    test('HashLink with correct default props', () => {
      const link = getWrapper().find(HashLink);
      expect(link).toHaveLength(1);
      const to = `${window.location.pathname}${window.location.search}#${defaultProps.destinationId}`;
      expect(link.prop('className')).toBe('internal-link');
      expect(link.prop('to')).toBe(to);
      expect(link.prop('children')).toEqual(<span>test link</span>);
    });

    test('HashLink with correct className when prop srOnly is true', () => {
      const link = getWrapper({srOnly: true}).find(HashLink);
      expect(link).toHaveLength(1);
      expect(link.prop('className')).toBe('internal-link hidden-link');
    });
  });
});
