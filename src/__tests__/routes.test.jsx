import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import AppRoutes from '../routes';
import config from '../config';

// Mock the components to be lazy-loaded
vi.mock('../views/Home', () => ({ default: () => <div>Home</div> }));
vi.mock('../views/Auth/silentRenew', () => ({ default: () => <div>SilentRenew</div> }));
vi.mock('../views/Info', () => ({ default: () => <div>Info</div> }));
vi.mock('../views/CookieManagement', () => ({ default: () => <div>CookieManagement</div> }));
vi.mock('../views/AccessibilityInfo', () => ({ default: () => <div>AccessibilityInfo</div> }));
vi.mock('../views/Hearings', () => ({ default: () => <div>Hearings</div> }));
vi.mock('../views/Hearing/HearingContainer', () => ({ default: () => <div>HearingContainer</div> }));
vi.mock('../views/NewHearing/NewHearingContainer', () => ({ default: () => <div>NewHearingContainer</div> }));
vi.mock('../views/FullscreenHearing/FullscreenHearingContainer', () => ({
  default: () => <div>FullscreenHearingContainer</div>,
}));
vi.mock('../views/Auth/loginCallback', () => ({ default: () => <div>LoginCallback</div> }));
vi.mock('../views/Auth/logoutCallback', () => ({ default: () => <div>LogoutCallback</div> }));
vi.mock('../views/UserHearings', () => ({ default: () => <div>UserHearings</div> }));
vi.mock('../views/UserProfile', () => ({ default: () => <div>UserProfile</div> }));

describe('AppRoutes', () => {
  const renderWithRouter = (route) =>
    render(
      <MemoryRouter initialEntries={[route]}>
        <AppRoutes />
      </MemoryRouter>,
    );

  it('should render Home component for the root route', async () => {
    await act(async () => {
      renderWithRouter('/');
    });
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should render SilentRenew component for the /silent-renew route', async () => {
    await act(async () => {
      renderWithRouter('/silent-renew');
    });
    expect(screen.getByText('SilentRenew')).toBeInTheDocument();
  });

  it('should render Info component for the /info route', async () => {
    await act(async () => {
      renderWithRouter('/info');
    });
    expect(screen.getByText('Info')).toBeInTheDocument();
  });

  if (config.enableCookies) {
    it('should render CookieManagement component for the /cookies route', async () => {
      await act(async () => {
        renderWithRouter('/cookies');
      });
      expect(screen.getByText('CookieManagement')).toBeInTheDocument();
    });
  }

  it('should render LoginCallback component for the /callback route', async () => {
    await act(async () => {
      renderWithRouter('/callback');
    });
    expect(screen.getByText('LoginCallback')).toBeInTheDocument();
  });

  it('should render LogoutCallback component for the /callback/logout route', async () => {
    await act(async () => {
      renderWithRouter('/callback/logout');
    });
    expect(screen.getByText('LogoutCallback')).toBeInTheDocument();
  });

  it('should render UserHearings component for the /user-hearings route', async () => {
    await act(async () => {
      renderWithRouter('/user-hearings');
    });
    expect(screen.getByText('UserHearings')).toBeInTheDocument();
  });

  it('should render UserProfile component for the /user-profile route', async () => {
    await act(async () => {
      renderWithRouter('/user-profile');
    });
    expect(screen.getByText('UserProfile')).toBeInTheDocument();
  });

  if (config.showAccessibilityInfo) {
    it('should render AccessibilityInfo component for the /accessibility route', async () => {
      await act(async () => {
        renderWithRouter('/accessibility');
      });
      expect(screen.getByText('AccessibilityInfo')).toBeInTheDocument();
    });
  }

  it('should render HearingsContainer component for the /hearings/:tab route', async () => {
    await act(async () => {
      renderWithRouter('/hearings/test-tab');
    });
    expect(screen.getByText('Hearings')).toBeInTheDocument();
  });

  it('should render NewHearingContainer component for the /hearing/new route', async () => {
    await act(async () => {
      renderWithRouter('/hearing/new');
    });
    expect(screen.getByText('NewHearingContainer')).toBeInTheDocument();
  });

  it('should render Redirector component for the /hearing/:hearingSlug route', async () => {
    await act(async () => {
      renderWithRouter('/hearing/test-slug');
    });
    expect(screen.getByText('HearingContainer')).toBeInTheDocument();
  });

  it('should render FullscreenHearingContainer component for the /:hearingSlug/fullscreen route', async () => {
    await act(async () => {
      renderWithRouter('/test-slug/fullscreen');
    });
    expect(screen.getByText('FullscreenHearingContainer')).toBeInTheDocument();
  });

  it('should render HearingContainer component for the /:hearingSlug/* route', async () => {
    await act(async () => {
      renderWithRouter('/test-slug/any-path');
    });
    expect(screen.getByText('HearingContainer')).toBeInTheDocument();
  });
});
