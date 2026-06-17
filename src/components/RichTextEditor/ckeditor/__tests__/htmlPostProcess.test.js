import { fromAppHtml, toAppHtml } from '../htmlPostProcess';

const EXTERNAL_MSG = 'avautuu uudessa välilehdessä';

describe('htmlPostProcess', () => {
  describe('toAppHtml', () => {
    it('returns empty string for empty input', () => {
      expect(toAppHtml('')).toBe('');
      expect(toAppHtml(undefined)).toBe('');
    });

    it('decorates external links with class, data flag, aria-label and icon', () => {
      const result = toAppHtml(
        '<p><a href="https://example.com">link</a></p>',
        EXTERNAL_MSG
      );

      expect(result).toContain('href="https://example.com"');
      expect(result).toContain('data-external="true"');
      expect(result).toContain('class="hds-link"');
      expect(result).toContain(`aria-label="link ${EXTERNAL_MSG}"`);
      expect(result).toContain('hds-icon--link-external');
    });

    it('leaves internal/anchor links untouched', () => {
      const result = toAppHtml(
        '<p><a href="#target">skip</a></p>',
        EXTERNAL_MSG
      );

      expect(result).not.toContain('data-external');
      expect(result).not.toContain('hds-icon--link-external');
      expect(result).toContain('href="#target"');
    });

    it('wraps bare iframes in the responsive wrapper div', () => {
      const result = toAppHtml(
        '<iframe src="https://www.youtube.com/embed/x"></iframe>'
      );

      expect(result).toContain('<div class="iframe-wrapper"><iframe');
      expect(result).toContain('</iframe></div>');
    });

    it('does not duplicate the external icon when run twice', () => {
      const once = toAppHtml(
        '<p><a href="https://example.com">link</a></p>',
        EXTERNAL_MSG
      );
      const twice = toAppHtml(fromAppHtml(once), EXTERNAL_MSG);

      const matches = twice.match(/hds-icon--link-external/g) || [];
      expect(matches).toHaveLength(1);
    });
  });

  describe('fromAppHtml', () => {
    it('strips the external-link icon span so CKEditor holds a clean link', () => {
      const stored =
        '<p><a class="hds-link" data-external="true" href="https://example.com" ' +
        'aria-label="link msg">link <span class="hds-icon icon hds-icon--link-external ' +
        'hds-icon--size-xs vertical-align-small-icon" aria-hidden="true"></span></a></p>';

      const result = fromAppHtml(stored);

      expect(result).not.toContain('hds-icon--link-external');
      expect(result).toContain('>link</a>');
    });

    it('returns empty string for empty input', () => {
      expect(fromAppHtml('')).toBe('');
    });
  });

  it('round-trips link content without accumulating markup', () => {
    const original = '<p><a href="https://example.com">link</a></p>';
    const stored = toAppHtml(original, EXTERNAL_MSG);
    const reopened = fromAppHtml(stored);
    const storedAgain = toAppHtml(reopened, EXTERNAL_MSG);

    expect(storedAgain).toBe(stored);
  });
});
