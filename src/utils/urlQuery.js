import { parse, stringify } from 'qs';

export const parseQuery = (searchString) =>
  parse(searchString, { ignoreQueryPrefix: true });

export const stringifyQuery = (searchObject) =>
  stringify(searchObject, { addQueryPrefix: true, indices: false });

export const checkHeadlessParam = (searchString) => {
  const { headless } = parseQuery(searchString);
  if (Array.isArray(headless)) {
    return headless.indexOf('true') > -1;
  }
  return headless === 'true';
};
