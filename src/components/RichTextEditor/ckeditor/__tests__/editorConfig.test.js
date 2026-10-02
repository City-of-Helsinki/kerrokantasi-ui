import { buildEditorConfig } from '../editorConfig';

// These rules were checked against stored Draft.js content in a real browser:
// each one, if reverted, corrupts existing hearings on the first save.
describe('buildEditorConfig html support', () => {
  const { allow } = buildEditorConfig().htmlSupport;

  it('does not allow target on links, which splits a link into two anchors', () => {
    const anchorRule = allow.find((rule) => rule.name === 'a');
    expect(anchorRule.attributes).not.toContain('target');
  });

  it('does not keep iframe wrapper divs, which are re-added on save', () => {
    expect(allow.some((rule) => rule.name === 'div')).toBe(false);
  });
});
