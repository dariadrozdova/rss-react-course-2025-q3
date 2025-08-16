'use client';

import { X } from 'lucide-react';

import PokemonDetailsContent from '@/components/PokemonDetailsContent';
import { usePokemonDetails } from '@/hooks/usePokemonDetails';
import { classNames } from '@/utils/classNames';

const MIN_CONTAINER_HEIGHT = 'min-h-[600px]';

interface DetailsPanelProps {
  onClose: () => void;
  pokemonId: string;
}

const mainPanelClasses = classNames(
  'relative overflow-hidden theme-card rounded-lg shadow-md md:col-span-1',
  'transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg',
  'bg-theme-secondary p-6',
  MIN_CONTAINER_HEIGHT,
  'max-h-[700px] overflow-y-auto'
);

const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button
    className="p-2 rounded cursor-pointer text-theme-secondary"
    onClick={onClick}
  >
    <X size={20} />
  </button>
);

const StatePanel = ({
  message,
  onClose,
  title,
}: {
  message: string;
  onClose: () => void;
  title: string;
}) => (
  <>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold">{title}</h2>
      <CloseButton onClick={onClose} />
    </div>
    <p className="text-theme-secondary mb-4">{message}</p>
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded"
      onClick={onClose}
    >
      Go Back
    </button>
  </>
);

export default function DetailsPanel({
  onClose,
  pokemonId,
}: DetailsPanelProps) {
  const { error, isLoading, pokemonDetails } = usePokemonDetails(pokemonId);

  if (isLoading) {
    return (
      <div className={mainPanelClasses}>
        <div className="flex justify-center items-center py-8">
          <div className="border-4 border-gray-200 border-t-blue-500 rounded-full w-10 h-10 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={mainPanelClasses}>
        <StatePanel message={error} onClose={onClose} title="Error" />
      </div>
    );
  }

  if (!pokemonDetails) {
    return (
      <div className={mainPanelClasses}>
        <StatePanel
          message="Pokémon not found"
          onClose={onClose}
          title="Not Found"
        />
      </div>
    );
  }

  return (
    <div className={mainPanelClasses}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold capitalize text-theme-primary">
          {pokemonDetails.name}
        </h2>
        <CloseButton onClick={onClose} />
      </div>
      <PokemonDetailsContent pokemon={pokemonDetails} />
    </div>
  );
}
