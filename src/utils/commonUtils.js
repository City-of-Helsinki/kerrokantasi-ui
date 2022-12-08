export function html2text(html) {
  const tag = document.createElement('div');
  tag.innerHTML = html;
  return tag.innerText || html;
}

export default { html2text };
