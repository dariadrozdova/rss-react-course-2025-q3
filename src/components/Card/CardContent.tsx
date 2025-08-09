import type { PokemonItem } from '@types';

import { cn } from '@utils/cn';

import PokemonImage from './PokemonImage';
import SelectionCheckbox from './SelectionCheckbox';

interface CardContentProps {
  imageError: boolean;
  imageLoaded: boolean;
  imageUrl: string | undefined;
  isItemSelected: boolean;
  isSelected: boolean;
  item: PokemonItem;
  onCheckboxChange: () => void;
}

function CardContent({
  imageError,
  imageLoaded,
  imageUrl,
  isItemSelected,
  isSelected,
  item,
  onCheckboxChange,
}: CardContentProps) {
  return (
    <>
      <strong
        className={cn(
          'mb-2.5 capitalize font-bold text-base md:text-lg transition-colors',
          isSelected
            ? 'text-[var(--color-primary-green)]'
            : 'text-theme-primary group-hover:text-[var(--theme-text-hover-teal)]'
        )}
      >
        {item.name}
      </strong>

      <PokemonImage
        imageError={imageError}
        imageLoaded={imageLoaded}
        imageUrl={imageUrl}
        name={item.name}
      />

      <SelectionCheckbox
        isItemSelected={isItemSelected}
        onCheckboxChange={onCheckboxChange}
      />
    </>
  );
}

export default CardContent;
