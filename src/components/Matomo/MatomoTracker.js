/* eslint-disable no-underscore-dangle */
import { TRACK_TYPES } from './constants';

class MatomoTracker {
  constructor(userOptions) {
    if (!userOptions.urlBase) {
      throw new Error('Matomo urlBase is required');
    }

    if (!userOptions.siteId) {
      throw new Error('Matomo siteId is required.');
    }

    this.initialize(userOptions);
  }

  initialize({
    urlBase,
    siteId,
    srcUrl = 'matomo.js',
    trackerUrl = 'matomo.php',
    enabled = true,
    linkTracking = true,
    configurations = {},
  }) {
    if (typeof window === 'undefined') {
      return;
    }

    globalThis._paq = globalThis._paq || [];

    if (globalThis._paq.length !== 0) {
      return;
    }

    if (!enabled) {
      return;
    }

    this.pushInstruction('setTrackerUrl', `${urlBase}${trackerUrl}`);
    this.pushInstruction('setSiteId', siteId);

    Object.entries(configurations).forEach(([name, instructions]) => {
      if (Array.isArray(instructions)) {
        this.pushInstruction(name, ...instructions);
      } else if (instructions === undefined) {
        this.pushInstruction(name);
      } else {
        this.pushInstruction(name, instructions);
      }
    });

    this.enableLinkTracking(linkTracking);

    const doc = document;
    const scriptElement = doc.createElement('script');
    const scripts = doc.getElementsByTagName('script')[0];

    scriptElement.type = 'text/javascript';
    scriptElement.async = true;
    scriptElement.defer = true;
    scriptElement.src = `${urlBase}${srcUrl}`;

    if (scripts?.parentNode) {
      scripts?.parentNode.insertBefore(scriptElement, scripts);
    }
  }

  enableLinkTracking(active) {
    this.pushInstruction('enableLinkTracking', active);
  }

  pushInstruction(name, ...args) {
    if (typeof window !== 'undefined') {
      globalThis._paq.push([name, ...args]);
    }

    return this;
  }

  trackPageView(params) {
    this.track({ data: [TRACK_TYPES.TRACK_VIEW], ...params });
  }

  track({ data = [], documentTitle = document.title, href }) {
    if (data.length) {
      this.pushInstruction('setCustomUrl', href ?? window.location.href);
      this.pushInstruction('setDocumentTitle', documentTitle);

      this.pushInstruction(...data);
    }
  }
}

export default MatomoTracker;
