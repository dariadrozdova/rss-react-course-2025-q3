import { useOutletContext, useParams } from 'react-router-dom';

import { X } from 'lucide-react';

import { useLoaderTimeout } from '@hooks/useLoaderTimeout';
import { usePokemonDetails } from '@hooks/usePokemonDetails';

import PokemonDetailsContent from './PokemonDetailsContent';

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
}) => {
  return (
    <div
      className={`rounded-lg shadow-md p-6 ${MIN_CONTAINER_HEIGHT} bg-theme-secondary`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className={`${titleClassName} text-theme-primary`}>{title}</h2>
        <button
          className="p-2 rounded hover:bg-theme-hover-secondary text-theme-secondary"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      {children}
    </div>
  );
};

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
          <p className="text-theme-secondary mb-4">Pokémon not found</p>
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
    <div
      className={`rounded-lg shadow-md p-6 min-h-[600px] bg-theme-secondary`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold capitalize text-theme-primary">
          {pokemon.name}
        </h2>
        <button
          className="p-2 rounded cursor-pointer hover:bg-theme-hover-secondary text-theme-secondary"
          onClick={handleCloseDetails}
        >
          <X size={20} />
        </button>
      </div>

      <PokemonDetailsContent pokemon={pokemon} />
    </div>
  );
}

export default PokemonDetails;
