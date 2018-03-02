import {parseQuery} from '../utils/urlQuery';

// reducer to add field isInWebView to global state (check if url query param has headless=true)
export default function isInWebView() {
  return parseQuery(window.location.search).headless === 'true';
}
