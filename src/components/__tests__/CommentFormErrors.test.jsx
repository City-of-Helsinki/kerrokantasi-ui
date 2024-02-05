import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';

import CommentFormErrors from '../CommentFormErrors';
import { getIntlAsProp } from '../../../test-utils';
import renderWithProviders from '../../utils/renderWithProviders';

const defaultProps = {
  commentRequiredError: false,
  commentOrAnswerRequiredError: false,
  imageTooBig: false,
};

const renderComponent = (propsOverrides) =>
  renderWithProviders(
    <MemoryRouter>
      <CommentFormErrors intl={getIntlAsProp()} {...defaultProps} {...propsOverrides} />
    </MemoryRouter>,
  );

describe('<CommentFormErrors />', () => {
  it('should render nothing when no errors are present', () => {
    const { container } = renderComponent();

    expect(container.outerHTML).toBe('<div></div>');
  });

  it('should render alert when errors', () => {
    renderComponent({ commentRequiredError: true });

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should render comment required error', () => {
    renderComponent({ commentRequiredError: true });

    expect(screen.getByText('commentRequiredError')).toBeInTheDocument();
  });

  it('should render comment or answer required error', () => {
    renderComponent({ commentOrAnswerRequiredError: true });

    expect(screen.getByText('commentOrAnswerRequiredError')).toBeInTheDocument();
  });

  it('should render image size error', () => {
    renderComponent({ imageTooBig: true });

    expect(screen.getByText('imageSizeError')).toBeInTheDocument();
  });
});
