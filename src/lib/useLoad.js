import { useCallback, useEffect, useRef, useState } from 'react';
import { errorMessage } from './utils.js';

export function useLoad(loader, deps = [], { enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState('');
  const loaderRef = useRef(loader);
  loaderRef.current = loader;
  const counter = useRef(0);

  const reload = useCallback(async () => {
    const run = counter.current + 1;
    counter.current = run;
    setLoading(true);
    setError('');
    try {
      const result = await loaderRef.current();
      if (counter.current === run) setData(result);
    } catch (err) {
      if (counter.current === run) {
        setError(errorMessage(err));
        setData(null);
      }
    } finally {
      if (counter.current === run) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) reload();
    else {
      setData(null);
      setLoading(false);
    }
  }, [enabled, ...deps]);

  return { data, loading, error, reload, setData };
}
