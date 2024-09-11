import React from 'react';
import { screen, fireEvent } from '@testing-library/react';

import ShowMore from '../ShowMore';
import renderWithProviders from '../../../../utils/renderWithProviders';

describe('<ShowMore />', () => {
  const defaultProps = {
    numberOfComments: 5,
    onClickShowMore: jest.fn(),
    isLoadingSubComment: false,
    open: false,
  };

  const renderComponent = (props = {}) => renderWithProviders(<ShowMore {...defaultProps} {...props} />);

  test('renders correctly', () => {
    renderComponent();
  });

  test('renders loading spinner when isLoadingSubComment is true', () => {
    renderComponent({ isLoadingSubComment: true });

    expect(screen.queryByText('showMoreReplies')).not.toBeInTheDocument();
  });

  test('displays correct message when open is true', () => {
    renderComponent({ open: true });

    expect(screen.getByText('hideReplies')).toBeInTheDocument();
  });

  test('calls onClickShowMore when the link is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button'));
    expect(defaultProps.onClickShowMore).toHaveBeenCalled();
  });
});
