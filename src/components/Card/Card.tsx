import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import type { CardProps } from '@types';

import { useGetPokemonDetailsQuery } from '@api/pokemonApiSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { toggleItemSelection } from '@store/slices/selectedItemsSlice';
import { cn } from '@utils/cn';

import CardContent from './CardContent';

import { selectIsItemSelected } from '@/store/selectors';

function Card({
  currentPage,
  isSelected = false,
  item,
  onPokemonClick,
}: CardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const dispatch = useAppDispatch();

  const isItemSelected = useAppSelector((state) =>
    selectIsItemSelected(state, item.id)
  );

  const { data: pokemonDetails, error: pokemonDetailsError } =
    useGetPokemonDetailsQuery(item.name, {
      skip: !item.name,
    });

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

  const getImageUrl = () => {
    if (item.imageUrl) {
      return item.imageUrl;
    }

    if (pokemonDetails?.sprites?.front_default && !pokemonDetailsError) {
      return pokemonDetails.sprites.front_default;
    }

    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`;
  };

  const imageUrl = getImageUrl();

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png`;
    if (e.currentTarget.src === fallbackUrl) {
      setImageLoaded(true);
      setImageError(true);
    } else {
      e.currentTarget.src = fallbackUrl;
    }
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
    imageError,
    imageLoaded,
    imageUrl,
    isItemSelected,
    isSelected,
    item,
    onCheckboxChange: handleCheckboxChange,
    onImageError: handleImageError,
    onImageLoad: handleImageLoad,
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
