import { useState, useEffect } from 'react';
import { useApiTokensClientTracking } from 'hds-react';

const MAX_UPDATE_TOKENS_RETRIES = 5;

const useUpdateApiTokens = () => {
  const [apiTokensUpdated, setApiTokensUpdated] = useState(false);
  const [retries, setRetries] = useState(0);

  const [lastSignal] = useApiTokensClientTracking();

  useEffect(() => {
    if (lastSignal && !apiTokensUpdated) {
      const { payload } = lastSignal;
      const { data } = payload;

      if (data) {
        setApiTokensUpdated(true);
      }
    }
  }, [apiTokensUpdated, lastSignal]);

  const updateApiTokens = async () =>
    new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!apiTokensUpdated && retries < MAX_UPDATE_TOKENS_RETRIES) {
          const increase = retries + 1;

          setRetries(increase);
        }

        if (apiTokensUpdated || retries >= MAX_UPDATE_TOKENS_RETRIES) {
          clearInterval(interval);

          resolve();
        }
      }, 1000);
    });

  return { apiTokensUpdated, updateApiTokens }
}

export default useUpdateApiTokens;