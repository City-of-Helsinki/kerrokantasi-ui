import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { IntlProvider } from 'react-intl';

const mockOpenBanner = vi.fn();
const mockUseCookieConsentContext = vi.fn();
const mockIsCookiebotEnabled = vi.fn();

// Mock only the functions we need to control in tests
vi.mock('../../../hooks/useCookieConsent', async () => {
  const actual = await vi.importActual('../../../hooks/useCookieConsent');
  return {
    ...actual,
    useHDSCookieContext: () => mockUseCookieConsentContext(),
  };
});

vi.mock('../../../utils/cookiebotUtils', () => ({
  isCookiebotEnabled: () => mockIsCookiebotEnabled(),
}));

import ExternalContentPlaceholder from '../ExternalContentPlaceholder';

const messages = {
  externalContentBlocked: 'External content blocked',
  externalContentBlockedDescription: 'Content from {url} requires marketing consent',
  openExternalSite: 'Open externally',
  editCookieSettings: 'Cookie settings',
};

const renderWithProviders = (component) => {
  return render(
    <IntlProvider locale='en' messages={messages}>
      {component}
    </IntlProvider>,
  );
};

describe('ExternalContentPlaceholder', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsCookiebotEnabled.mockReturnValue(false); // Default to HDS mode
    mockUseCookieConsentContext.mockReturnValue({
      openBanner: mockOpenBanner,
    });
  });

  describe('rendering', () => {
    it('renders placeholder with domain from URL', () => {
      renderWithProviders(<ExternalContentPlaceholder url='https://www.youtube.com/embed/test123' />);

      expect(screen.getByText('External content blocked')).toBeInTheDocument();
      expect(screen.getByText(/www\.youtube\.com/)).toBeInTheDocument();
      expect(screen.getByText('Open externally')).toBeInTheDocument();
      expect(screen.getByText('Cookie settings')).toBeInTheDocument();
    });
  });

  describe('open externally', () => {
    it('open external video in new window', () => {
      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

      renderWithProviders(<ExternalContentPlaceholder url='https://suite.icareus.com/video/123' />);

      const openButton = screen.getByText('Open externally');
      fireEvent.click(openButton);

      expect(windowOpenSpy).toHaveBeenCalledWith(
        'https://suite.icareus.com/video/123',
        '_blank',
        'noopener,noreferrer',
      );

      windowOpenSpy.mockRestore();
    });
  });

  describe('cookie settings button', () => {
    it('opens HDS cookie banner when available', () => {
      mockIsCookiebotEnabled.mockReturnValue(false);

      renderWithProviders(<ExternalContentPlaceholder url='https://www.youtube.com/embed/test' />);

      const settingsButton = screen.getByText('Cookie settings');
      fireEvent.click(settingsButton);

      expect(mockOpenBanner).toHaveBeenCalledTimes(1);
    });

    it('opens Cookiebot when HDS not available', () => {
      mockIsCookiebotEnabled.mockReturnValue(true);
      const mockRenew = vi.fn();
      window.Cookiebot = { renew: mockRenew };

      renderWithProviders(<ExternalContentPlaceholder url='https://www.youtube.com/embed/test' />);

      const settingsButton = screen.getByText('Cookie settings');
      fireEvent.click(settingsButton);

      expect(mockRenew).toHaveBeenCalledTimes(1);
      expect(mockOpenBanner).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('handles null and undefined URL gracefully', () => {
      const { container: containerNull } = renderWithProviders(<ExternalContentPlaceholder url={null} />);
      expect(containerNull.firstChild).toBeNull();
      const { container: containerUndefined } = renderWithProviders(<ExternalContentPlaceholder url={undefined} />);
      expect(containerUndefined.firstChild).toBeNull();
    });

    it('handles invalid URL format', () => {
      // Invalid URL should not crash the component
      expect(() => {
        renderWithProviders(<ExternalContentPlaceholder url='not-a-valid-url' />);
      }).not.toThrow();
    });
  });
});
