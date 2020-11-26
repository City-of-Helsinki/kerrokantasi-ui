/* eslint-disable import/prefer-default-export */
export function isUrl(string) {
  try { return Boolean(new URL(string)); } catch (error) { return false; }
}
