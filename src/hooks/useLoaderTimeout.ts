import { useEffect, useState } from 'react';

export const useLoaderTimeout = (
  detailsId: string | undefined,
  timeoutMs: number = 500
) => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, timeoutMs);

    return () => {
      clearTimeout(timer);
    };
  }, [detailsId, timeoutMs]);

  useEffect(() => {
    if (detailsId) {
      setShowLoader(true);
    }
  }, [detailsId]);

  return showLoader;
};
