"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  enabled = true,
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  // Keep a ref to the latest fetcher without making it a dependency
  const fetcherRef = useRef(fetcher);

  // Update the ref inside an effect so the React Compiler is satisfied
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const load = useCallback(async () => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!enabled) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetcherRef.current();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load data.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return {
    data,
    setData,
    isLoading,
    error,
    refetch: load,
  };
}
