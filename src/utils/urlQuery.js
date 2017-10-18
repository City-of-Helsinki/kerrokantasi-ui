import { parse, stringify } from 'qs';

export const parseQuery = searchString => {
  return parse(searchString, { ignoreQueryPrefix: true });
};

export const stringifyQuery = searchObject => {
  return stringify(searchObject, { addQueryPrefix: true, indices: false });
};
