import React, { useState } from 'react';

import { pokemonApi, useGetPokemonListQuery } from '@api/pokemonApiSlice'; // Adjust path as needed
import Button from '@components/Button';
import { useAppDispatch } from '@store/hooks';

interface CacheInvalidationButtonProps {
  disabled?: boolean;
}

const INVALIDATION_DELAY = 500;

const CacheInvalidationButton: React.FC<CacheInvalidationButtonProps> = ({
  disabled = false,
}) => {
  const dispatch = useAppDispatch();
  const [isInvalidating, setIsInvalidating] = useState(false);

  const { refetch: refetchPokemonList } = useGetPokemonListQuery(
    { limit: 10_000, offset: 0 },
    { skip: false }
  );

  const handleInvalidateCache = async () => {
    setIsInvalidating(true);

    try {
      dispatch(pokemonApi.util.resetApiState());

      await refetchPokemonList();

      setTimeout(() => {
        setIsInvalidating(false);
      }, INVALIDATION_DELAY);
    } catch (error) {
      console.warn('Failed to invalidate cache:', error);
      setIsInvalidating(false);
    }
  };

  return (
    <Button
      className="whitespace-nowrap flex-shrink-0 flex items-center gap-2"
      color="red"
      disabled={disabled || isInvalidating}
      onClick={handleInvalidateCache}
      size="small"
      title="Clear all cached data and refetch"
    >
      {isInvalidating ? (
        <>
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              fill="currentColor"
            />
          </svg>
          Clearing...
        </>
      ) : (
        'Clear Cache'
      )}
    </Button>
  );
};

export default CacheInvalidationButton;
