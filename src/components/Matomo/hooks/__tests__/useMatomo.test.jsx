import React, { useEffect } from 'react';
import { render, renderHook } from '@testing-library/react';

import MatomoContext, { MatomoProvider } from '../../matomo-context';
import * as MatomoTracker from '../../MatomoTracker';
import useMatomo from '../useMatomo';

const MOCK_URL = 'https://www.hel.fi';

describe('useMatomo', () => {
  it('should return trackPageView function', () => {
    const trackPageView = vi.fn();
    const instance = { trackPageView };

    const wrapper = ({ children }) => <MatomoContext.Provider value={instance}>{children}</MatomoContext.Provider>;

    const { result } = renderHook(() => useMatomo(), { wrapper });

    expect(result.current.trackPageView).toBeDefined();
  });

  const MockedComponent = () => {
    const { trackPageView } = useMatomo();

    useEffect(() => {
      trackPageView({ href: MOCK_URL });
    }, [trackPageView]);

    return <div>MockedComponent</div>;
  };

  it('should trackPageView', () => {
    const trackPageViewMock = vi.fn();

    vi.spyOn(MatomoTracker, 'default').mockImplementation(() => ({
      trackPageView: trackPageViewMock,
    }));

    const instance = new MatomoTracker.default({
      urlBase: MOCK_URL,
      siteId: 'test123',
      srcUrl: 'test.js',
      enabled: true,
    });

    const MockProvider = () => (
      <MatomoProvider value={instance}>
        <MockedComponent />
      </MatomoProvider>
    );

    expect(MatomoTracker.default).toHaveBeenCalled();

    render(<MockProvider />);

    expect(trackPageViewMock).toHaveBeenCalledWith({
      href: MOCK_URL,
    });
  });
});
