import React from 'react';
import { fireEvent, screen } from '@testing-library/react';

import RichTextEditor from '..';
import renderWithProviders from '../../../utils/renderWithProviders';
import { getIntlAsProp } from '../../../../test-utils';

// Stub modals so submit-path tests don't require Draft entity state plumbing.
// These stubs render the same observable text as the real modals (iframeModalTitle etc.)
// so the existing open/close tests continue to pass.
vi.mock('../Iframe/IframeModal', () => ({
  default: ({ isOpen, onClose, onSubmit }) =>
    isOpen ? (
      <div>
        <span>iframeModalTitle</span>
        <button onClick={() => onSubmit({ src: 'https://example.com' })}>
          iframe-submit
        </button>
        <button onClick={onClose}>cancel</button>
      </div>
    ) : null,
}));

vi.mock('../Image/ImageModal', () => ({
  default: ({ isOpen, onClose, onSubmit }) =>
    isOpen ? (
      <div>
        <span>imageModalTitle</span>
        <button
          onClick={() => onSubmit('https://example.com/image.jpg', 'Alt text')}
        >
          image-submit
        </button>
        <button onClick={onClose}>cancel</button>
      </div>
    ) : null,
}));

vi.mock('../SkipLink/SkipLinkModal', () => ({
  default: ({ isOpen, onClose, onSubmit }) =>
    isOpen ? (
      <div>
        <span>skipLinkModalTitle</span>
        <button
          onClick={() =>
            onSubmit('Skip to content', 'skip-id', 'main-content', false)
          }
        >
          skiplink-submit
        </button>
        <button onClick={onClose}>cancel</button>
      </div>
    ) : null,
}));

const renderComponent = (props = {}) => {
  const defaultProps = {
    labelId: 'someLabelId',
    onBlur: vi.fn(),
    onChange: vi.fn(),
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
    const onChange = vi.fn();
    renderComponent({ onChange });

    fireEvent.input(screen.getByRole('textbox'), {
      target: { textContent: 'Hello' },
    });

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

  it('renders label text from labelId prop', () => {
    renderComponent({ labelId: 'testLabelId' });
    expect(screen.getByText('testLabelId')).toBeInTheDocument();
  });

  it('initializes editor content from value prop', () => {
    renderComponent({ value: '<p>Hello world</p>' });
    expect(screen.getByRole('textbox')).toHaveTextContent('Hello world');
  });

  it('renders placeholder text from placeholderId prop when editor is empty', () => {
    renderComponent({ placeholderId: 'richTextPlaceholderId' });
    expect(screen.getByText('richTextPlaceholderId')).toBeInTheDocument();
  });

  it.each([
    ['hideBlockStyleControls', 'Väliotsikko'],
    ['hideInlineStyleControls', 'Lihavointi'],
    ['hideIframeControls', 'Lisää iframe'],
    ['hideImageControls', 'Lisää kuva'],
    ['hideSkipLinkControls', 'Lisää hyppylinkki'],
    ['hideLinkControls', 'Lisää linkki'],
  ])('hides toolbar section when %s is true', (controlKey, triggerText) => {
    renderComponent({
      hideControls: {
        hideBlockStyleControls: false,
        hideInlineStyleControls: false,
        hideIframeControls: false,
        hideImageControls: false,
        hideSkipLinkControls: false,
        hideLinkControls: false,
        [controlKey]: true,
      },
    });
    expect(screen.queryByText(triggerText)).not.toBeInTheDocument();
  });

  // confirmIframe/confirmImage/confirmSkipLink all call setTimeout(() => onFocus(), 0)
  // which fires after test cleanup and causes a null ref error. Fake timers prevent this.
  describe('modal submit', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('iframe modal submit closes the modal without error', () => {
      renderComponent();
      fireEvent.click(screen.getByText('Lisää iframe'));
      fireEvent.click(screen.getByText('iframe-submit'));
      expect(screen.queryByText('iframeModalTitle')).not.toBeInTheDocument();
    });

    it('image modal submit closes the modal without error', () => {
      renderComponent();
      fireEvent.click(screen.getByText('Lisää kuva'));
      fireEvent.click(screen.getByText('image-submit'));
      expect(screen.queryByText('imageModalTitle')).not.toBeInTheDocument();
    });

    it('skip link modal submit closes the modal without error', () => {
      renderComponent();
      fireEvent.click(screen.getByText('Lisää hyppylinkki'));
      fireEvent.click(screen.getByText('skiplink-submit'));
      expect(screen.queryByText('skipLinkModalTitle')).not.toBeInTheDocument();
    });
  });
});
