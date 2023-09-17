'use-client';

import { RequestConfig, UseHttpReturnType } from '@/shared/types';
import { useCallback, useState } from 'react';

const useHttp = (): UseHttpReturnType => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const sendRequest = useCallback(async ({ url, method = 'GET', headers = {}, body }: RequestConfig, applyData: (data: Record<string, string>[]) => void) => {
    setIsLoading(true);
    setError(null); 

    try {
      const response = await fetch(
        url,
        {
          method: method,
          headers: headers,
          body: JSON.stringify(body),
        }
      );
      if (!response.ok) throw new Error('Request failed!');

      const data: Record<string, string>[] = await response.json();
      applyData(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Something went wrong!'));
    }
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
  };
};
export default useHttp;