import React from 'react';

export function html2text(html) {
  const tag = document.createElement('div');
  tag.innerHTML = html;
  return tag.innerText || html;
}

/**
 * Converts newlines in a string to an array of strings and <br> elements,
 * suitable for rendering inside JSX (replaces the react-nl2br package).
 */
export function nl2br(text) {
  if (!text) return text;
  return text
    .split('\n')
    .flatMap((s, i) =>
      i === 0 ? [s] : [React.createElement('br', { key: i }), s]
    );
}

export default { html2text, nl2br };
