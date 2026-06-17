import {
  stripWrappingFigureTags,
  addIframeWrapperDivs,
} from '../../../utils/iframeUtils';
import isExternalLink from '../../../utils/isExternalLink';

// Markup the old Draft.js editor produced and the rest of the app still expects:
//   - external links carry an `hds-link` class, `data-external` flag, an aria-label
//     and a trailing external-link icon span
//   - iframes are wrapped in <div class="iframe-wrapper"> (handled by iframeUtils)
//
// CKEditor only stores the bare <a data-external="true"> / <iframe> markup, so we
// re-add these decorations on the way out (getData -> stored value) and strip them
// on the way in (stored value -> setData) to avoid duplicating them on every edit.

const EXTERNAL_ICON_CLASS =
  'hds-icon icon hds-icon--link-external hds-icon--size-xs vertical-align-small-icon';

const WHITESPACE = ' \t\n\r\f ';

const isExternalIconSpan = (span) =>
  span.classList.contains('hds-icon--link-external');

// Trim trailing whitespace off an element's last text node (removing it entirely
// if it becomes empty). Done manually to avoid a backtracking-prone regex.
const trimTrailingWhitespace = (element) => {
  const last = element.lastChild;
  if (!last || last.nodeType !== 3) return;
  const text = last.textContent;
  let end = text.length;
  while (end > 0 && WHITESPACE.includes(text[end - 1])) end -= 1;
  if (end === 0) {
    last.remove();
  } else {
    last.textContent = text.slice(0, end);
  }
};

const parseHtml = (html) => {
  const parser = new DOMParser();
  return parser.parseFromString(`<body>${html || ''}</body>`, 'text/html');
};

const serializeBody = (doc) => doc.body.innerHTML;

/**
 * Strip app-specific decorations so CKEditor holds clean links.
 * Removes external-link icon spans and the aria-label/data-external attributes;
 * the link decorator + post-processing re-derive them on save.
 * @param {string} html stored value
 * @returns {string} html for CKEditor setData / initial data
 */
export const fromAppHtml = (html) => {
  if (!html) return '';
  const doc = parseHtml(html);

  doc.querySelectorAll('a').forEach((anchor) => {
    anchor
      .querySelectorAll('span')
      .forEach((span) => isExternalIconSpan(span) && span.remove());
    // The icon span was preceded by a whitespace separator; drop it too.
    trimTrailingWhitespace(anchor);
  });

  return serializeBody(doc);
};

/**
 * Re-add the decorations the rest of the app relies on.
 * @param {string} html value returned by editor.getData()
 * @param {string} externalLinkMessage localized "opens in a new tab"-style text
 * @returns {string} value to store
 */
export const toAppHtml = (html, externalLinkMessage = '') => {
  if (!html) return '';
  const doc = parseHtml(html);

  doc.querySelectorAll('a').forEach((anchor) => {
    const href = anchor.getAttribute('href') || '';
    if (!isExternalLink(href)) return;

    const text = anchor.textContent.trim();
    if (externalLinkMessage) {
      anchor.setAttribute('aria-label', `${text} ${externalLinkMessage}`);
    }
    anchor.setAttribute('data-external', 'true');
    if (!anchor.classList.contains('hds-link')) {
      anchor.classList.add('hds-link');
    }

    // Avoid duplicate icons / spacing if one somehow survived a previous pass.
    anchor
      .querySelectorAll('span')
      .forEach((span) => isExternalIconSpan(span) && span.remove());
    trimTrailingWhitespace(anchor);

    const icon = doc.createElement('span');
    icon.setAttribute('class', EXTERNAL_ICON_CLASS);
    icon.setAttribute('aria-hidden', 'true');
    anchor.appendChild(doc.createTextNode(' '));
    anchor.appendChild(icon);
  });

  // Wrap bare <iframe> tags in the responsive wrapper the consent renderer expects.
  return addIframeWrapperDivs(stripWrappingFigureTags(serializeBody(doc)));
};
