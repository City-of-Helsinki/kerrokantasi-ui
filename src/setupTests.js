/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

import fetchMock from 'jest-fetch-mock';

jest.setTimeout(100000);

fetchMock.enableMocks();
// Needed for tests to work with react-slick, check https://github.com/akiran/react-slick#test-setup
// eslint-disable-next-line func-names
window.matchMedia = window.matchMedia || function () {
  return {
    matches: false,
    addListener: () => { },
    removeListener: () => { }
  };
};

window.scrollTo = jest.fn();

Object.assign(global, { TextDecoder, TextEncoder });

const originalError = console.error.bind(console.error);

console.error = (msg, ...optionalParams) => {
  const msgStr = msg.toString();

  return (
    !msgStr.includes('Could not parse CSS stylesheet') && !msgStr.match(/Cannot format message:/i) && !msgStr.match(/Missing message:/i) &&
    originalError(msg, ...optionalParams)
  );
};
