import { createElement } from 'react';

export function html2text(html) {
  const tag = document.createElement('div');
  tag.innerHTML = html;
  return tag.innerText || html;
}

/** Converts newlines in a string to an array of strings and <br> elements, suitable for rendering inside JSX. */
export function nl2br(text) {
  if (!text) return text;
  return text.split('\n').flatMap((segment, index, segments) =>
    index === 0
      ? [segment]
      : [
          createElement('br', {
            key: segments.slice(0, index + 1).join('\n'),
          }),
          segment,
        ]
  );
}

export default { html2text, nl2br };
