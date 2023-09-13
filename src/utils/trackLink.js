import config from '../config';

/**
 * DEPRECATED
 * TODO: REMOVE OR REFACTOR IF NEEDED
*/
const trackLink = () => {
  /* global Piwik */
  try {
    const tracker = Piwik.getTracker(config.uiConfig.piwikUrl, 2);
    tracker.trackLink(document.URL);
  } catch (err) {
    /* When entering the site, Piwik is not yet defined. Entering will
    be tracked by Piwik once it has finished loading.
     */
  }
};

export default trackLink;
