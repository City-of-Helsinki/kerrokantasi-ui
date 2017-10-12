import { parse } from 'qs';

const parseUrlSearch = searchString => {
  let parsedString = searchString.replace('?', '');
  parsedString = parse(parsedString);
  return parsedString;
};

export default parseUrlSearch;
