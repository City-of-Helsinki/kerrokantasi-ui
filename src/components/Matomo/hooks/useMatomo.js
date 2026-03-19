import { useCallback, useContext } from 'react';

import MatomoContext from '../matomo-context';

function useMatomo() {
  const instance = useContext(MatomoContext);

  const trackPageView = useCallback(
    (params) => instance?.trackPageView(params),
    [instance]
  );

  return { trackPageView };
}

export default useMatomo;
