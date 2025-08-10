import { useEffect, useMemo, useState } from 'react';

import { useGetPokemonImageQuery } from '@api/pokemonApiSlice';

interface UsePokemonImageResult {
  finalImageUrl: string | undefined;
  hasError: boolean;
  isLoading: boolean;
}

export const usePokemonImage = (
  urls: (string | undefined)[]
): UsePokemonImageResult => {
  const validUrls = useMemo(() => urls.filter(Boolean), [urls]);
  const [urlIndex, setUrlIndex] = useState(0);
  const currentUrl = validUrls[urlIndex];

  const {
    data: imageDataUrl,
    isError,
    isFetching,
    isLoading,
  } = useGetPokemonImageQuery(currentUrl || '', {
    skip: !currentUrl,
  });

  useEffect(() => {
    setUrlIndex(0);
  }, [validUrls]);

  useEffect(() => {
    if ((imageDataUrl === null || isError) && urlIndex < validUrls.length - 1) {
      setUrlIndex((previousIndex) => previousIndex + 1);
    }
  }, [imageDataUrl, isError, urlIndex, validUrls.length]);

  const allAttemptsFailed =
    (imageDataUrl === null || isError) && urlIndex >= validUrls.length - 1;

  return {
    finalImageUrl: imageDataUrl || undefined,
    hasError: allAttemptsFailed,
    isLoading: isLoading || isFetching,
  };
};
