/* eslint-disable no-console */
import '@testing-library/jest-dom/vitest';
import { TextEncoder, TextDecoder } from 'util';

import { vi } from 'vitest';
import createFetchMock from 'vitest-fetch-mock';
import dotenv from 'dotenv';

import { getCityConfig, getCityPublic } from '../scripts/utils';

const USE_TEST_ENV = process.env.NODE_ENV === 'test';
const defaultNodeEnv = USE_TEST_ENV ? 'test' : 'development';
const runtimeEnv = {
  ...process.env,
  NODE_ENV: process.env.NODE_ENV || defaultNodeEnv,
};

dotenv.config({
  processEnv: runtimeEnv,
  ...(USE_TEST_ENV
    ? { path: ['.env', '.env.test'] }
    : { path: ['.env', '.env.local'] }),
  override: true,
});

const cityConfig = getCityConfig(runtimeEnv);
const cityPublic = getCityPublic(runtimeEnv, cityConfig);

// Load generated runtime configuration to be available in tests
require(`${cityPublic}/test-env-config`);

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();
// Needed for tests to work with react-slick, check https://github.com/akiran/react-slick#test-setup
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {},
    };
  };

window.scrollTo = vi.fn();
window.HTMLElement.prototype.scrollIntoView = vi.fn();

class MockObserver {
  constructor() {
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
  }
}

// Mock ResizeObserver which is not available in JSDOM
global.ResizeObserver = MockObserver;

// Mock IntersectionObserver which is not available in JSDOM
global.IntersectionObserver = MockObserver;

Object.assign(global, { TextDecoder, TextEncoder });

// JSDOM-level virtualConsole filter: suppress noisy, non-actionable errors that
// are emitted directly from JSDOM (not through our console.error override).
// JSDOM's default virtualConsole was set up at construction time in the host
// module context, so its captured `console` reference bypasses any per-worker
// `console.error` override. Replacing the `jsdomError` listener here is the
// only reliable interception point.
// eslint-disable-next-line no-underscore-dangle
const virtualConsole = window.jsdom?.virtualConsole || window._virtualConsole;
if (virtualConsole?.removeAllListeners && virtualConsole?.on) {
  virtualConsole.removeAllListeners('jsdomError');
  virtualConsole.on('jsdomError', (error) => {
    const msg = error?.message ?? '';
    if (msg.includes('Could not parse CSS stylesheet')) return;
    if (msg.includes('Not implemented: navigation')) return;
    console.error(error.stack, error.detail);
  });
}

const originalError = console.error.bind(console.error);

console.error = (msg, ...optionalParams) => {
  const msgStr = msg.toString();

  return (
    !msgStr.includes('Could not parse CSS stylesheet') &&
    !msgStr.includes('Not implemented: navigation') &&
    !msgStr.match(/Cannot format message:/i) &&
    !msgStr.match(/Missing message:/i) &&
    // react-intl 7 / @formatjs/intl memoization regression — non-actionable upstream
    !msgStr.match(/Cannot read properties of undefined \(reading '"/) &&
    originalError(msg, ...optionalParams)
  );
};
