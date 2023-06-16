import config from '../config';

const setupMatomo = () => {
  /* eslint-disable */
  var _paq = window._paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(['setDocumentTitle', document.domain + '/' + document.title]);

  var domains = config.matomoDomains ? config.matomoDomains.split(',') : '';

  //_paq.push(['setCookieDomain', '*.kerrokantasi.hel.fi']);
  _paq.push(['setCookieDomain', config.matomoCookieDomain]);
  _paq.push(['setDomains', domains]);
  _paq.push(['setDoNotTrack', true]);
  _paq.push(['disableCookies']);
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function () {
    var tracker = config.matomoScriptFilename === 'matomo.js' ? 'matomo.php' : 'tracker.php';
    var u = config.matomoScriptUrl;
    _paq.push(['setTrackerUrl', u + tracker]);
    _paq.push(['setSiteId', config.matomoSiteId]);
    var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
    g.type = 'text/javascript';
    g.async = true;
    g.src = u + config.matomoScriptFilename;
    if(s) {
      s.parentNode.insertBefore(g, s);
    }
  })();
}

export default setupMatomo;