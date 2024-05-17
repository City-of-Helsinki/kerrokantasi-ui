import defaultFetch from 'cross-fetch';

let fetch = defaultFetch;

/**
 * Change the `fetch` implementation used. Useful for tests.
 *
 * @param newFetch New fetch implementation. Set to a falsy value to restore the default fetch.
 */
export function replace(newFetch = null) {
  fetch = newFetch || defaultFetch;
}

// eslint-disable-next-line func-names
export default function (...args) {
  // Proxy on to the current fetch implementation
  return fetch.apply(this, args);
}
