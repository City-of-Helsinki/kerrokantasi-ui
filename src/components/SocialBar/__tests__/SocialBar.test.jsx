import React from 'react';
import { render } from '@testing-library/react';

import SocialBar from '..';

const renderComponent = () => render(<SocialBar />);

describe('<SocialBar />', () => {
  it('should have a container for Facebook Sharing', () => {
    const { container } = renderComponent();

    expect(container.querySelector('.fb-share-button')).toBeInTheDocument();
  });

  it('should have a container for tweeting', () => {
    const { container } = renderComponent();

    expect(container.querySelector('.twitter-tweet-ctr')).toBeInTheDocument();
  });
});
