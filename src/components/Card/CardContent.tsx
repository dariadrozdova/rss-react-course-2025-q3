import type { PokemonItem } from '@types';
import React from 'react';

import PokemonImage from './PokemonImage';
import SelectionCheckbox from './SelectionCheckbox';

interface CardContentProps {
  imageError: boolean;
  imageLoaded: boolean;
  imageUrl: string;
  isItemSelected: boolean;
  isSelected: boolean;
  item: PokemonItem;
  onCheckboxChange: () => void;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onImageLoad: () => void;
}

function CardContent({
  imageError,
  imageLoaded,
  imageUrl,
  isItemSelected,
  isSelected,
  item,
  onCheckboxChange,
  onImageError,
  onImageLoad,
}: CardContentProps) {
  return (
    <>
      <strong
        className={`
          mb-2.5 capitalize font-bold text-base md:text-lg transition-colors
          ${
            isSelected
              ? 'text-[var(--color-primary-green)]'
              : 'text-theme-primary group-hover:text-[var(--theme-text-hover-teal)]'
          }
        `}
      >
        {item.name}
      </strong>

      <PokemonImage
        imageError={imageError}
        imageLoaded={imageLoaded}
        imageUrl={imageUrl}
        name={item.name}
        onImageError={onImageError}
        onImageLoad={onImageLoad}
      />

      <SelectionCheckbox
        isItemSelected={isItemSelected}
        onCheckboxChange={onCheckboxChange}
      />
    </>
  );
}

export default CardContent;
