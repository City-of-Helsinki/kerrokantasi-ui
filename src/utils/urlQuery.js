import { parse, stringify } from 'qs';
import {isArray} from 'lodash';

export const parseQuery = searchString => {
  return parse(searchString, { ignoreQueryPrefix: true });
};

export const stringifyQuery = searchObject => {
  return stringify(searchObject, { addQueryPrefix: true, indices: false });
};

export const checkHeadlessParam = (searchString) => {
  const headless = parseQuery(searchString).headless;
  if (isArray(headless)) {
    return headless.indexOf('true') > -1;
  }
  return headless === 'true';
};
