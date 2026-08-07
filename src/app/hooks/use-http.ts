'use client';

import type { RequestConfig, UseHttpReturnType } from '@/shared/types';
import { useCallback, useState } from 'react';

const useHttp = (): UseHttpReturnType => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendRequest = useCallback(async (
    { url, method = 'GET', headers = {}, body }: RequestConfig,
    applyData?: (data: unknown) => void,
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`İstek başarısız oldu (${response.status}).`);
      }

      const data: unknown = method === 'DELETE' ? null : await response.json();
      applyData?.(data);
      return true;
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError
          : new Error('Beklenmeyen bir hata oluştu.'),
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, sendRequest };
};

export default useHttp;
