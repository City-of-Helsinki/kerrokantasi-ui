import { vi } from 'vitest';
import DOMPurify from 'dompurify';

import { convertEmbedToViewUrl, sanitizeHtml } from '../externalContent';

describe('externalContent utilities', () => {
  describe('convertEmbedToViewUrl', () => {
    it('converts YouTube embed URL to watch URL', () => {
      const embedUrl = 'https://www.youtube.com/embed/abc123';
      const result = convertEmbedToViewUrl(embedUrl);
      expect(result).toBe('https://www.youtube.com/watch?v=abc123');
    });

    it('returns original URL for non-YouTube embed URLs', () => {
      const url = 'https://suite.icareus.com/video/123';
      const result = convertEmbedToViewUrl(url);
      expect(result).toBe(url);
    });

    it('handles null, undefined and empty URL', () => {
      const resultNull = convertEmbedToViewUrl(null);
      expect(resultNull).toBeNull();
      const resultUndefined = convertEmbedToViewUrl(undefined);
      expect(resultUndefined).toBeUndefined();
      const resultEmpty = convertEmbedToViewUrl('');
      expect(resultEmpty).toBe('');
    });

    it('handles YouTube short URLs', () => {
      const shortUrl = 'https://youtu.be/xyz789';
      const result = convertEmbedToViewUrl(shortUrl);
      expect(result).toBe('https://www.youtube.com/watch?v=xyz789');
    });
  });

  describe('sanitizeHtml', () => {
    it('sanitizes and parses HTML', () => {
      const html = '<p>Hello <strong>World</strong></p>';
      const result = sanitizeHtml(html);

      // Should return React element(s)
      expect(result).toBeTruthy();
      expect(Array.isArray(result) || typeof result === 'object').toBe(true);
    });

    it('removes script tags', () => {
      const html = '<p>Safe content</p><script>alert("XSS")</script>';
      const sanitizeSpy = vi.spyOn(DOMPurify, 'sanitize');

      sanitizeHtml(html);

      const sanitizedResult = sanitizeSpy.mock.results[0].value;
      expect(sanitizedResult).not.toContain('script');
      expect(sanitizedResult).not.toContain('alert');

      sanitizeSpy.mockRestore();
    });

    it('returns empty array for null, undefined and empty string', () => {
      const resultNull = sanitizeHtml(null);
      expect(resultNull).toEqual([]);
      const resultUndefined = sanitizeHtml(undefined);
      expect(resultUndefined).toEqual([]);
      const resultEmpty = sanitizeHtml('');
      expect(resultEmpty).toEqual([]);
    });

    it('handles complex nested HTML', () => {
      const html = `
        <div>
          <h2>Title</h2>
          <p>Paragraph with <a href="https://example.com">link</a></p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </div>
      `;
      const result = sanitizeHtml(html);

      // Should return React element(s)
      expect(result).toBeTruthy();
      expect(Array.isArray(result) || typeof result === 'object').toBe(true);
    });

    it('sanitizes HTML correctly', () => {
      const html = '<iframe src="https://www.youtube.com/embed/test" allowfullscreen></iframe>';
      const sanitizeSpy = vi.spyOn(DOMPurify, 'sanitize');

      sanitizeHtml(html);

      // DOMPurify.sanitize was called
      expect(sanitizeSpy).toHaveBeenCalled();
      sanitizeSpy.mockRestore();
    });
  });
});
