import { renderHook, act } from '@testing-library/react';
import * as mockLogin from 'hds-react';

import useUpdateApiTokens from '../hooks/useUpdateApiTokens';

jest.spyOn(mockLogin, 'useApiTokensClientTracking').mockImplementation(() => [{ payload: {} }]);

describe('useUpdateApiTokens', () => {
  it('should update api tokens', async () => {
    const { result, rerender } = renderHook(() => useUpdateApiTokens());

    expect(result.current.apiTokensUpdated).toBe(false);

    jest
      .spyOn(mockLogin, 'useApiTokensClientTracking')
      .mockImplementationOnce(() => [{ payload: { data: { key: 'value' } } }]);

    act(() => {
      result.current.updateApiTokens();
    });

    rerender();

    expect(result.current.apiTokensUpdated).toBe(true);
  });
});
