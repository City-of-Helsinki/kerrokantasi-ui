import config from '../config';

const setupMatomo = () => {
  /* eslint-disable */
  var _paq = window._paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(['setDocumentTitle', document.domain + '/' + document.title]);

  //_paq.push(['setCookieDomain', '*.kerrokantasi.hel.fi']);
  _paq.push(['setCookieDomain', config.matomoCookieDomain]);
  _paq.push(['setDomains', config.matomoDomains]);
  _paq.push(['setDoNotTrack', true]);
  _paq.push(['disableCookies']);
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function () {
    
    
    var u = config.matomoScriptUrl;
    _paq.push(['setTrackerUrl', u + 'tracker.php']);
    _paq.push(['setSiteId', '380']);
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