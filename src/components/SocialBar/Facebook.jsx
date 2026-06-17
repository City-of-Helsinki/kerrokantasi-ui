import { useRef, useEffect, useId } from 'react';

import loadScriptThenCall from './utils';

export default function Facebook() {
  const id = useId();
  const containerRef = useRef(null);

  useEffect(() => {
    function setupFacebookWidget(FB) {
      FB.init({ version: 'v2.4' });
      FB.XFBML.parse(containerRef.current);
    }
    loadScriptThenCall(
      'facebook-jssdk',
      '//connect.facebook.net/en_US/sdk.js',
      'FB',
      setupFacebookWidget
    );
  }, []);

  if (typeof window === 'undefined') {
    // Unable to render this without a valid `window`
    return null;
  }
  return (
    <span ref={containerRef} id={`facebook-${id}`}>
      <div
        className='fb-share-button'
        data-href={window.location.href}
        data-layout='button_count'
      />
    </span>
  );
}
