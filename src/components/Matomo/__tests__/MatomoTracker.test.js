/* eslint-disable sonarjs/no-clear-text-protocols */
/* eslint-disable sonarjs/constructor-for-side-effects */
/* eslint-disable no-underscore-dangle */
import MatomoTracker from '../MatomoTracker';
import { TRACK_TYPES } from '../constants';

const MOCK_URL_BASE = 'https://www.test.fi/';
const MOCK_TRACKER_URL = 'https://www.test.fi/matomo.php';

describe('MatomoTracker', () => {
  beforeEach(() => {
    globalThis._paq = [];
  });

  it('should initialise globalThis._paq', () => {
    new MatomoTracker({
      urlBase: MOCK_URL_BASE,
      siteId: 'test123',
      srcUrl: 'test.js',
      enabled: true,
      configurations: {
        foo: 'bar',
        testArray: ['testArrayItem1', 'testArrayItem2'],
        testNoValue: undefined,
      },
    });

    expect(globalThis._paq).toEqual([
      ['setTrackerUrl', MOCK_TRACKER_URL],
      ['setSiteId', 'test123'],
      ['foo', 'bar'],
      ['testArray', 'testArrayItem1', 'testArrayItem2'],
      ['testNoValue'],
      ['enableLinkTracking', true],
    ]);
  });

  it('should throw error if urlBase missing', () => {
    expect(() => new MatomoTracker({ siteId: 'test123' })).toThrowError();
  });

  it('should throw error if siteId missing', () => {
    expect(
      () =>
        new MatomoTracker({
          urlBase: 'http://www.test.fi',
        }),
    ).toThrowError();
  });

  it('should track page view', () => {
    const tracker = new MatomoTracker({
      urlBase: MOCK_URL_BASE,
      siteId: 'test123',
      srcUrl: 'test.js',
      enabled: true,
      configurations: {},
    });

    tracker.trackPageView();

    expect(globalThis._paq).toEqual([
      ['setTrackerUrl', MOCK_TRACKER_URL],
      ['setSiteId', 'test123'],
      ['enableLinkTracking', true],
      ['setCustomUrl', window.location.href],
      ['setDocumentTitle', ''],
      [TRACK_TYPES.TRACK_VIEW],
    ]);
  });

  it('should track custom event', () => {
    const tracker = new MatomoTracker({
      urlBase: MOCK_URL_BASE,
      siteId: 'test123',
      srcUrl: 'test.js',
      enabled: true,
      configurations: {},
    });

    tracker.track({
      data: ['event', 'click', 'button'],
      documentTitle: 'Custom Event',
      href: 'https://www.test.fi/custom-event',
    });

    expect(globalThis._paq).toEqual([
      ['setTrackerUrl', MOCK_TRACKER_URL],
      ['setSiteId', 'test123'],
      ['enableLinkTracking', true],
      ['setCustomUrl', 'https://www.test.fi/custom-event'],
      ['setDocumentTitle', 'Custom Event'],
      ['event', 'click', 'button'],
    ]);
  });
});
