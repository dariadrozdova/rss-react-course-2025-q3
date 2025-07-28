import { useAppDispatch, useAppSelector } from '@store/hooks';
import { toggleItemSelection } from '@store/slices/selectedItemsSlice';
import type { CardProps } from '@types';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import CardContent from './CardContent';

import { useTheme } from '@/context/ThemeContext';
import { selectIsItemSelected } from '@/store/selectors';

function Card({
  currentPage,
  isSelected = false,
  item,
  onPokemonClick,
}: CardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isDark } = useTheme();
  const dispatch = useAppDispatch();

  const isItemSelected = useAppSelector((state) =>
    selectIsItemSelected(state, item.id)
  );

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

  const imageUrl =
    item.imageUrl ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`;

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
    transition-all duration-300 ease-in-out h-[280px] border
    ${isDark ? 'bg-gray-800' : 'bg-white'}
    ${
      isSelected || isItemSelected
        ? 'border-teal-400 shadow-lg ring-2 ring-teal-200 -translate-y-1'
        : isDark
          ? 'border-gray-600 hover:-translate-y-1 hover:shadow-lg hover:border-teal-400'
          : 'border-gray-200 hover:-translate-y-1 hover:shadow-lg hover:border-teal-400'
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
    <div className={baseClass + ' cursor-pointer'} onClick={handleClick}>
      <CardContent {...cardContentProps} />
    </div>
  ) : (
    <Link className={baseClass} to={`/${currentPage}/${item.id}`}>
      <CardContent {...cardContentProps} />
    </Link>
  );
}

export default Card;
