import { useCallback, useEffect, useState } from 'react';

type Settled<T> = { key: string; data?: T; error?: Error };

/**
 * Runs an async loader whenever `deps` change and exposes loading / error / data plus `reload`.
 * While a new request is loading, the previous `data` stays available so screens don't flash.
 */
export function useAsync<T>(loader: () => Promise<T>, deps: (string | number | boolean | undefined)[]) {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);
  const key = JSON.stringify([...deps, attempt]);

  useEffect(() => {
    let cancelled = false;
    loader().then(
      (data) => !cancelled && setSettled({ key, data }),
      (error: unknown) =>
        !cancelled && setSettled({ key, error: error instanceof Error ? error : new Error(String(error)) }),
    );
    return () => {
      cancelled = true;
    };
    // `key` captures deps and retry attempts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  const current = settled?.key === key;

  if (current && settled.error) {
    return { status: 'error' as const, error: settled.error, data: undefined, reload };
  }
  if (current) {
    return { status: 'success' as const, data: settled.data as T, error: undefined, reload };
  }
  return { status: 'loading' as const, data: settled?.data, error: undefined, reload };
}
