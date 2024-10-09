import React from 'react';
import { fireEvent, screen } from '@testing-library/react';

import RichTextEditor from '..';
import renderWithProviders from '../../../utils/renderWithProviders';
import { getIntlAsProp } from '../../../../test-utils';

const renderComponent = (props = {}) => {
  const defaultProps = {
    labelId: 'someLabelId',
    onBlur: jest.fn(),
    onChange: jest.fn(),
    hideControls: {
      hideBlockStyleControls: false,
      hideInlineStyleControls: false,
      hideIframeControls: false,
      hideImageControls: false,
      hideSkipLinkControls: false,
      hideLinkControls: false,
    },
    intl: getIntlAsProp(),
  };

  return renderWithProviders(<RichTextEditor {...defaultProps} {...props} />);
};

describe('<RichTextEditor />', () => {
  it('renders correctly', () => {
    renderComponent();
  });

  it('calls onChange when editor state changes', () => {
    const onChange = jest.fn();
    renderComponent({ onChange });

    fireEvent.input(screen.getByRole('textbox'), { target: { textContent: 'Hello' } });

    expect(onChange).toHaveBeenCalled();
  });

  it('opens and closes the iframe modal', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Lisää iframe'));
    expect(screen.getByText('iframeModalTitle')).toBeInTheDocument();

    fireEvent.click(screen.getByText('cancel'));
    expect(screen.queryByText('iframeModalTitle')).not.toBeInTheDocument();
  });

  it('opens and closes the image modal', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Lisää kuva'));
    expect(screen.getByText('imageModalTitle')).toBeInTheDocument();

    fireEvent.click(screen.getByText('cancel'));
    expect(screen.queryByText('imageModalTitle')).not.toBeInTheDocument();
  });

  it('opens and closes the skip link modal', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Lisää hyppylinkki'));
    expect(screen.getByText('skipLinkModalTitle')).toBeInTheDocument();

    fireEvent.click(screen.getByText('cancel'));
    expect(screen.queryByText('skipLinkModalTitle')).not.toBeInTheDocument();
  });
});
