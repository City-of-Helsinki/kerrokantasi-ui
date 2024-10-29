import { renderHook, act } from '@testing-library/react-hooks';
import * as mockLogin from 'hds-react';

import useUpdateApiTokens from '../hooks/useUpdateApiTokens';

jest.spyOn(mockLogin, 'useApiTokensClientTracking').mockImplementation(() => [{ payload: {} }]);

describe('useUpdateApiTokens', () => {
  it('should update api tokens', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useUpdateApiTokens());

    expect(result.current.apiTokensUpdated).toBe(false);

    jest
      .spyOn(mockLogin, 'useApiTokensClientTracking')
      .mockImplementationOnce(() => [{ payload: { data: { key: 'value' } } }]);

    act(() => {
      result.current.updateApiTokens();
    });

    await waitForNextUpdate();

    expect(result.current.apiTokensUpdated).toBe(true);
  });
});
