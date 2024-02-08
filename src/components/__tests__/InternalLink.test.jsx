import React from 'react';
import { render } from '@testing-library/react';

import InternalLink from '../InternalLink';

const defaultProps = {
  destinationId: 'some-destination',
  srOnly: false,
};

function renderComponent(props) {
  return render(
    <InternalLink {...defaultProps} {...props}>
      <span>test link</span>
    </InternalLink>,
  );
}

describe('<InternalLink />', () => {
  it('should render with correct default props', () => {
    const { getByRole } = renderComponent();

    const link = getByRole('link');

    const href = `#${defaultProps.destinationId}`;

    expect(link.className).toBe('internal-link');
    expect(link.getAttribute('href')).toBe(href);
    expect(link.children).toHaveLength(1);
  });

  it('should render with correct className when prop srOnly is true', () => {
    const { getByRole } = renderComponent({ srOnly: true });

    const link = getByRole('link');

    expect(link.className).toBe('internal-link hidden-link');
  });
});
