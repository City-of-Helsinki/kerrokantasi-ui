import { buildIframeHtml, buildSkipLinkHtml } from '../embedHtml';

describe('embedHtml', () => {
  it('builds an iframe with the given attributes in a stable order', () => {
    expect(
      buildIframeHtml({
        allow: 'fullscreen',
        src: 'https://example.com/embed',
        title: 'Video',
        width: '560',
        height: '',
      })
    ).toBe(
      '<iframe src="https://example.com/embed" title="Video" width="560" allow="fullscreen"></iframe>'
    );
  });

  it('escapes quotes so a value cannot add attributes', () => {
    const html = buildIframeHtml({
      src: 'https://example.com/embed',
      title: 'Video "Kesä" onload="alert(1)',
    });
    const iframe = new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector('iframe');

    expect(iframe.getAttribute('title')).toBe('Video "Kesä" onload="alert(1)');
    expect(iframe.hasAttribute('onload')).toBe(false);
  });

  it('builds a skip link and keeps markup in its text as text', () => {
    const html = buildSkipLinkHtml(
      'Siirry <b>sisältöön</b>',
      'own',
      'target',
      true
    );
    const link = new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector('a');

    expect(link.getAttribute('href')).toBe('#target');
    expect(link.id).toBe('own');
    expect(link.className).toBe('hidden-link');
    expect(link.textContent).toBe('Siirry <b>sisältöön</b>');
    expect(link.querySelector('b')).toBeNull();
  });

  it('leaves out the class when the skip link is visible', () => {
    expect(buildSkipLinkHtml('Siirry', 'own', 'target', false)).toBe(
      '<a href="#target" id="own">Siirry</a>'
    );
  });
});
