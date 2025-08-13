import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import CardContent from './CardContent';

import { useGetPokemonDetailsQuery } from '@/api/pokemonApiSlice';
import { usePokemonImage } from '@/hooks/usePokemonImage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectIsItemSelected } from '@/store/selectors';
import { toggleItemSelection } from '@/store/slices/selectedItemsSlice';
import type { CardProps } from '@/types/';
import { cn } from '@/utils/cn';

function Card({
  currentPage,
  isSelected = false,
  item,
  onPokemonClick,
}: CardProps) {
  const dispatch = useAppDispatch();

  const isItemSelected = useAppSelector((state) =>
    selectIsItemSelected(state, item.id)
  );

  const { data: pokemonDetails, error: pokemonDetailsError } =
    useGetPokemonDetailsQuery(item.name, {
      skip: !item.name,
    });

  const imageUrls = useMemo(
    () => [
      item.imageUrl,
      pokemonDetails?.sprites?.front_default && !pokemonDetailsError
        ? pokemonDetails.sprites.front_default
        : undefined,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png`,
    ],
    [
      item.imageUrl,
      item.id,
      pokemonDetails?.sprites?.front_default,
      pokemonDetailsError,
    ]
  );

  const { finalImageUrl, hasError, isLoading } = usePokemonImage(imageUrls);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPokemonClick) {
      e.preventDefault();
      onPokemonClick(item.id);
    }
  };

  const handleCheckboxChange = () => {
    dispatch(toggleItemSelection(item));
  };

  const baseClass = `
    group p-4 sm:p-5 rounded-lg shadow-sm flex flex-col items-center text-center
    transition-all duration-300 ease-in-out min-h-[280px] border
    bg-theme-secondary
    ${
      isSelected
        ? 'border-teal-400 shadow-lg ring-2 ring-teal-200 -translate-y-1'
        : 'border-theme hover:-translate-y-1 hover:shadow-lg hover:border-teal-400'
    }
  `;

  const cardContentProps = {
    imageError: hasError,
    imageLoaded: !isLoading && !!finalImageUrl,
    imageUrl: finalImageUrl,
    isItemSelected,
    isSelected,
    item,
    onCheckboxChange: handleCheckboxChange,
  };

  return onPokemonClick ? (
    <div className={cn(baseClass, 'cursor-pointer')} onClick={handleClick}>
      <CardContent {...cardContentProps} />
    </div>
  ) : (
    <Link className={cn(baseClass)} to={`/${currentPage}/${item.id}`}>
      <CardContent {...cardContentProps} />
    </Link>
  );
}

export default Card;
