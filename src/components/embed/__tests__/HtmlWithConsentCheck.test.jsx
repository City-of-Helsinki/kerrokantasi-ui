import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import HtmlWithConsentCheck from '../HtmlWithConsentCheck';

// Mock useHasConsentGroup and HDS hooks
const mockUseHasConsentGroup = vi.fn();
vi.mock('../../../hooks/useCookieConsent', async () => {
  const actual = await vi.importActual('../../../hooks/useCookieConsent');
  return {
    ...actual,
    useHasConsentGroup: (group) => mockUseHasConsentGroup(group),
  };
});

// Mock ExternalContentPlaceholder
vi.mock('../ExternalContentPlaceholder', () => ({
  default: ({ url }) => (
    <div data-testid="external-content-placeholder">
      Placeholder for: {url}
    </div>
  ),
}));

describe('HtmlWithConsentCheck', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete window.Cookiebot;
  });

  describe('with empty or no content', () => {
    it('returns null when htmlString is null, undefined or empty', () => {
      mockUseHasConsentGroup.mockReturnValue(false);
      const { container: containerNull } = render(<HtmlWithConsentCheck htmlString={null} />);
      expect(containerNull.firstChild).toBeNull();
      const { container: containerUndefined } = render(<HtmlWithConsentCheck htmlString={undefined} />);
      expect(containerUndefined.firstChild).toBeNull();
      const { container: containerEmpty } = render(<HtmlWithConsentCheck htmlString="" />);
      expect(containerEmpty.firstChild).toBeNull();
    });
  });

  describe('without iframes', () => {
    it('renders sanitized HTML content without iframes', () => {
      mockUseHasConsentGroup.mockReturnValue(false);
      const htmlString = '<p>Hello World</p>';      
      const { container } = render(<HtmlWithConsentCheck htmlString={htmlString} />);
      expect(container.innerHTML).toContain('<p>Hello World</p>');
    });
  });

  describe('with iframes and marketing consent', () => {
    it('renders iframes when marketing consent is given', () => {
      mockUseHasConsentGroup.mockReturnValue(true);
      
      const htmlString = '<p>Video:</p><iframe src="https://www.youtube.com/embed/test"></iframe>';
      const { container } = render(<HtmlWithConsentCheck htmlString={htmlString} />);
      
      expect(screen.getByText('Video:')).toBeInTheDocument();
      expect(container.querySelector('iframe')).toBeInTheDocument();
      expect(container.querySelector('iframe').getAttribute('src')).toBe('https://www.youtube.com/embed/test');
    });
  });

  describe('with iframes and no consent', () => {
    it('replaces iframes with placeholders when no consent', () => {
      mockUseHasConsentGroup.mockReturnValue(false);
      
      const htmlString = '<iframe src="https://www.youtube.com/embed/test"></iframe>';
      const { container } = render(<HtmlWithConsentCheck htmlString={htmlString} />);
      
      expect(container.querySelector('iframe')).toBeNull();
      expect(screen.getByTestId('external-content-placeholder')).toBeInTheDocument();
      expect(screen.getByText(/Placeholder for: https:\/\/www.youtube.com\/embed\/test/)).toBeInTheDocument();
    });

    it('handles multiple iframes with surrounding content', () => {
      mockUseHasConsentGroup.mockReturnValue(false);
      
      const htmlString = `
        <p>First paragraph</p>
        <iframe src="https://www.youtube.com/embed/test1"></iframe>
        <p>Middle paragraph</p>
        <iframe src="https://www.youtube.com/embed/test2"></iframe>
        <p>Last paragraph</p>
      `;
      
      render(<HtmlWithConsentCheck htmlString={htmlString} />);
      
      expect(screen.getByText('First paragraph')).toBeInTheDocument();
      expect(screen.getByText('Middle paragraph')).toBeInTheDocument();
      expect(screen.getByText('Last paragraph')).toBeInTheDocument();
      expect(screen.getAllByTestId('external-content-placeholder')).toHaveLength(2);
    });
  });

  describe('consent state changes', () => {
    it('updates when consent changes from false to true', () => {
      // Initially no consent
      mockUseHasConsentGroup.mockReturnValue(false);
      const { rerender, container } = render(
        <HtmlWithConsentCheck htmlString='<iframe src="https://www.youtube.com/embed/test"></iframe>' />
      );
      
      expect(container.querySelector('iframe')).toBeNull();
      expect(screen.getByTestId('external-content-placeholder')).toBeInTheDocument();
      
      // After consent given
      mockUseHasConsentGroup.mockReturnValue(true);
      rerender(<HtmlWithConsentCheck htmlString='<iframe src="https://www.youtube.com/embed/test"></iframe>' />);
      expect(container.querySelector('iframe')).toBeInTheDocument();
      expect(screen.queryByTestId('external-content-placeholder')).not.toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles malformed iframe HTML gracefully', () => {
      mockUseHasConsentGroup.mockReturnValue(false);
      
      // Malformed HTML - unclosed iframe tag
      const htmlString = '<iframe src="https://www.youtube.com/embed/test">';
      
      // Should not crash the component
      expect(() => {
        render(<HtmlWithConsentCheck htmlString={htmlString} />);
      }).not.toThrow();
    });

    it('handles iframe without src attribute', () => {
      mockUseHasConsentGroup.mockReturnValue(false);
      
      const htmlString = '<p>Text content</p><iframe></iframe><p>More text</p>';
      
      render(<HtmlWithConsentCheck htmlString={htmlString} />);
      
      // Should NOT create placeholder for iframe without src
      expect(screen.queryByTestId('external-content-placeholder')).not.toBeInTheDocument();
      // But should render surrounding content
      expect(screen.getByText('Text content')).toBeInTheDocument();
      expect(screen.getByText('More text')).toBeInTheDocument();
    });

    it('handles iframe with empty src attribute', () => {
      mockUseHasConsentGroup.mockReturnValue(false);
      
      const htmlString = '<p>Before</p><iframe src=""></iframe><p>After</p>';
      
      render(<HtmlWithConsentCheck htmlString={htmlString} />);
      
      // Should NOT create placeholder for iframe with empty src
      expect(screen.queryByTestId('external-content-placeholder')).not.toBeInTheDocument();
      // But should render surrounding content
      expect(screen.getByText('Before')).toBeInTheDocument();
      expect(screen.getByText('After')).toBeInTheDocument();
    });

    it('removes iframe-wrapper divs when showing placeholders', () => {
      mockUseHasConsentGroup.mockReturnValue(false);
      
      const htmlString = '<p>Text</p><div class="iframe-wrapper"><iframe src="https://www.youtube.com/embed/test"></iframe></div><p>More text</p>';
      
      const { container } = render(<HtmlWithConsentCheck htmlString={htmlString} />);
      
      // Should NOT have empty iframe-wrapper divs
      expect(container.querySelector('.iframe-wrapper')).toBeNull();
      // Should have placeholder
      expect(screen.getByTestId('external-content-placeholder')).toBeInTheDocument();
      // Should have surrounding content
      expect(screen.getByText('Text')).toBeInTheDocument();
      expect(screen.getByText('More text')).toBeInTheDocument();
    });

    it('maintains correct HTML structure with wrapper replacement', () => {
      mockUseHasConsentGroup.mockReturnValue(false);
      
      const htmlString = '<div class="content"><p>Paragraph</p><div class="iframe-wrapper"><iframe src="https://www.youtube.com/embed/test"></iframe></div></div>';
      
      const { container } = render(<HtmlWithConsentCheck htmlString={htmlString} />);
      
      // Placeholder should be at same level as the paragraph, not breaking the structure
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
      expect(screen.getByTestId('external-content-placeholder')).toBeInTheDocument();
      
      // The content div should still be properly closed (no broken HTML)
      const contentDivs = container.querySelectorAll('.content');
      expect(contentDivs.length).toBe(1);
      expect(container.querySelector('.iframe-wrapper')).toBeNull();
    });

    it('handles iframes without wrapper correctly', () => {
      mockUseHasConsentGroup.mockReturnValue(false);
      
      const htmlString = '<div><p>Before</p><iframe src="https://www.youtube.com/embed/test"></iframe><p>After</p></div>';
      
      const { container } = render(<HtmlWithConsentCheck htmlString={htmlString} />);
      
      // Should handle unwrapped iframes correctly
      expect(screen.getByText('Before')).toBeInTheDocument();
      expect(screen.getByText('After')).toBeInTheDocument();
      expect(screen.getByTestId('external-content-placeholder')).toBeInTheDocument();
      
      // HTML structure should be maintained
      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('handles mixed wrapped and unwrapped iframes', () => {
      mockUseHasConsentGroup.mockReturnValue(false);
      
      const htmlString = `
        <p>Start</p>
        <div class="iframe-wrapper"><iframe src="https://www.youtube.com/embed/wrapped"></iframe></div>
        <p>Middle</p>
        <iframe src="https://www.youtube.com/embed/unwrapped"></iframe>
        <p>End</p>
      `;
      
      render(<HtmlWithConsentCheck htmlString={htmlString} />);
      
      // Should show all text content
      expect(screen.getByText('Start')).toBeInTheDocument();
      expect(screen.getByText('Middle')).toBeInTheDocument();
      expect(screen.getByText('End')).toBeInTheDocument();
      
      // Should show placeholders for both iframes
      const placeholders = screen.getAllByTestId('external-content-placeholder');
      expect(placeholders).toHaveLength(2);
    });

    it('preserves iframe attributes when consent given', () => {
      mockUseHasConsentGroup.mockReturnValue(true);
      
      const htmlString = `
        <iframe 
          src="https://www.youtube.com/embed/test"
          width="560"
          height="315"
          allow="accelerometer; autoplay"
          allowfullscreen
        ></iframe>
      `;
      
      const { container } = render(<HtmlWithConsentCheck htmlString={htmlString} />);
      
      const iframe = container.querySelector('iframe');
      expect(iframe).toBeInTheDocument();
      expect(iframe.getAttribute('width')).toBe('560');
      expect(iframe.getAttribute('height')).toBe('315');
      expect(iframe.getAttribute('allow')).toBe('accelerometer; autoplay');
      expect(iframe.hasAttribute('allowfullscreen')).toBe(true);
    });
  });
});
