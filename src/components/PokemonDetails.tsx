import { X } from 'lucide-react';
import { useOutletContext, useParams } from 'react-router-dom';

import { useLoaderTimeout } from '@hooks/useLoaderTimeout';
import { usePokemonDetails } from '@hooks/usePokemonDetails';

const MIN_CONTAINER_HEIGHT = 'min-h-[600px]';

const PokemonContainer = ({
  children,
  onClose,
  title = 'Loading...',
  titleClassName = 'text-xl font-bold',
}: {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
  titleClassName?: string;
}) => (
  <div className={`bg-white rounded-lg shadow-md p-6 ${MIN_CONTAINER_HEIGHT}`}>
    <div className="flex justify-between items-center mb-4">
      <h2 className={titleClassName}>{title}</h2>
      <button className="p-2 hover:bg-gray-100 rounded" onClick={onClose}>
        <X size={20} />
      </button>
    </div>
    {children}
  </div>
);

interface OutletContext {
  handleCloseDetails: () => void;
}

function PokemonDetails() {
  const { detailsId } = useParams<{ detailsId: string }>();
  const { handleCloseDetails } = useOutletContext<OutletContext>();
  const { error, isLoading, pokemon } = usePokemonDetails(detailsId);
  const showLoader = useLoaderTimeout(detailsId);

  if (isLoading || showLoader) {
    return (
      <PokemonContainer onClose={handleCloseDetails}>
        <div className="flex justify-center items-center py-8">
          <div className="border-4 border-gray-200 border-t-blue-500 rounded-full w-10 h-10 animate-spin" />
        </div>
      </PokemonContainer>
    );
  }

  if (error) {
    return (
      <PokemonContainer
        onClose={handleCloseDetails}
        title="Error"
        titleClassName="text-xl font-bold text-red-600"
      >
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleCloseDetails}
          >
            Go Back
          </button>
        </div>
      </PokemonContainer>
    );
  }

  if (!pokemon) {
    return (
      <PokemonContainer onClose={handleCloseDetails} title="Not Found">
        <div className="text-center py-8">
          <p className="mb-4">Pokémon not found</p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleCloseDetails}
          >
            Go Back
          </button>
        </div>
      </PokemonContainer>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold capitalize">{pokemon.name}</h2>
        <button
          className="p-2 hover:bg-gray-100 rounded"
          onClick={handleCloseDetails}
        >
          <X size={20} />
        </button>
      </div>

      <div className="text-center mb-6">
        {pokemon.sprites.front_default ? (
          <img
            alt={pokemon.name}
            className="w-48 h-48 mx-auto"
            src={pokemon.sprites.front_default}
          />
        ) : (
          <div className="w-48 h-48 mx-auto bg-gray-200 flex items-center justify-center">
            No image
          </div>
        )}
        <p className="mt-2 text-gray-500">#{pokemon.id}</p>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Types</h3>
        <div className="flex gap-2">
          {pokemon.types.map((typeInfo, index) => (
            <span
              className="px-3 py-1 bg-blue-500 text-white rounded capitalize"
              key={index}
            >
              {typeInfo.type.name}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Stats</h3>
        <div className="space-y-2">
          {pokemon.stats.map((statInfo, index) => (
            <div className="flex justify-between" key={index}>
              <span className="capitalize">{statInfo.stat.name}:</span>
              <span className="font-bold">{statInfo.base_stat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PokemonDetails;
