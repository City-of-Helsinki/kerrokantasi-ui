// eslint-disable-next-line import/no-unresolved
import urls from '@city-assets/urls.json';

/**
 * Checks if cookie with the name 'CookieConsent' exists.
 * If it exists and its value is 'true' -> addCookieScript() is called.
 * @example
 * const consentValue = document.cookie.split('; ')
 * .find(row => row.startsWith('CookieConsent')).split('=')[1];
 * if (consentValue === 'true') { addCookieScript(); }
 */
function checkCookieConsent() {
  if (document.cookie.split('; ').find(row => row.startsWith('CookieConsent'))) {
    const consentValue = document.cookie.split('; ').find(row => row.startsWith('CookieConsent')).split('=')[1];
    if (consentValue === 'true') {
      addCookieScript();
    }
  }
}

/**
 * Creates new script element with src from urls.analytics.
 *
 * Checks if a script element with that src already exists, if not then the element is appended to <head> .
 */
function addCookieScript() {
  const scriptElements = Object.values(document.getElementsByTagName('head')[0].getElementsByTagName('script'));
  if (!scriptElements.find(element => element.src.includes(urls.analytics))) {
    const cookieScript = document.createElement('script');
    cookieScript.type = 'text/javascript';
    cookieScript.src = `${urls.analytics}`;
    document.getElementsByTagName('head')[0].appendChild(cookieScript);
  }
}
export { checkCookieConsent, addCookieScript };
