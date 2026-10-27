// Builds the HTML inserted from the iframe and skip link modals. The elements
// are created through the DOM so the browser escapes the typed values: a `"`
// in a title or `<` in link text must not change the generated markup.

const IFRAME_ATTRIBUTES = [
  'src',
  'title',
  'width',
  'height',
  'scrolling',
  'allow',
];

/**
 * @param {object} fields values from the iframe modal
 * @returns {string} iframe HTML
 */
export const buildIframeHtml = (fields) => {
  const iframe = document.createElement('iframe');
  IFRAME_ATTRIBUTES.forEach((name) => {
    if (fields[name]) iframe.setAttribute(name, fields[name]);
  });
  return iframe.outerHTML;
};

/**
 * @param {string} text link text
 * @param {string} ownId id of the link itself
 * @param {string} targetId id of the element the link jumps to
 * @param {boolean} isHidden whether the link is visually hidden
 * @returns {string} anchor HTML
 */
export const buildSkipLinkHtml = (text, ownId, targetId, isHidden) => {
  const link = document.createElement('a');
  link.setAttribute('href', `#${targetId}`);
  link.setAttribute('id', ownId);
  if (isHidden) link.setAttribute('class', 'hidden-link');
  link.textContent = text;
  return link.outerHTML;
};
