import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter, useLocation } from 'react-router-dom';

import { get } from '../../api';
import useNotifications from '../useNotifications';

// Mock API call
vi.mock('../../api', () => ({
  get: vi.fn(),
}));

// Mock window.location
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn().mockReturnValue({ pathname: '/' }),
  };
});

const mockNotifications = [
  {
    id: '1',
    title: { fi: 'Test Title', en: 'Test Title EN', sv: 'Test Title SV' },
    content: { fi: 'Test Content', en: 'Test Content EN', sv: 'Test Content SV' },
    type_name: 'INFO',
    modified_at: '2023-01-01',
    external_url: { fi: 'https://example.com', en: 'https://example.com/en', sv: 'https://example.com/sv' },
    external_url_title: { fi: 'Link', en: 'Link EN', sv: 'Link SV' },
  },
];

const wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe('useNotifications', () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    
    // Reset individual mocks
    get.mockReset();
    
    // Reset and set default value for useLocation
    vi.mocked(useLocation).mockReset();
    vi.mocked(useLocation).mockReturnValue({ pathname: '/' });
  });

  it('should fetch and format notifications', async () => {
    get.mockResolvedValueOnce({
      json: async () => mockNotifications,
    });

    const { result } = renderHook(() => useNotifications('fi'), { wrapper });

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.notifications).toEqual([]);

    // Wait for the notifications to load
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Check if the API was called correctly
    expect(get).toHaveBeenCalledWith('/v1/notifications');
    
    // Check if notifications are formatted correctly
    expect(result.current.notifications).toEqual([
      {
        id: '1',
        title: 'Test Title',
        content: 'Test Content',
        level: 'info',
        modified_at: '2023-01-01',
        external_url: 'https://example.com',
        external_url_title: 'Link',
      },
    ]);

    // Check if visibleTypes is correct for home page
    expect(result.current.visibleTypes).toEqual(['error', 'warning', 'info']);
  });

  it('should show only error notifications on non-home pages', async () => {
    // Set up mocks before rendering
    const nonHomePath = '/some-other-page';
    get.mockResolvedValueOnce({
      json: async () => mockNotifications,
    });

    // Important: Mock useLocation BEFORE rendering the hook
    // Clear previous implementations and set a new one
    vi.mocked(useLocation).mockReset();
    vi.mocked(useLocation).mockReturnValue({ pathname: nonHomePath });

    // Render the hook after mocking
    const { result } = renderHook(() => useNotifications('fi'), { wrapper });

    // Wait for the hook to process
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Verify that our location mock is working
    expect(useLocation().pathname).toBe(nonHomePath);
    
    // Check if visibleTypes is restricted to errors on non-home pages
    expect(result.current.visibleTypes).toEqual(['error']);
  });

  it('should handle errors', async () => {
    const testError = new Error('Failed to fetch');
    get.mockRejectedValueOnce(testError);

    const { result } = renderHook(() => useNotifications('fi'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Check if error is captured
    expect(result.current.error).toBe(testError);
    expect(result.current.notifications).toEqual([]);
  });

  it('should not fetch if language is not provided', async () => {
    const { result } = renderHook(() => useNotifications(null), { wrapper });

    // Should not trigger loading state
    expect(result.current.isLoading).toBe(false);
    expect(get).not.toHaveBeenCalled();
  });
});
