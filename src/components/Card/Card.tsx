import React, { useMemo, useState } from 'react';

import Link from 'next/link';

import CardContent from './CardContent';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectIsItemSelected } from '@/store/selectors';
import { toggleItemSelection } from '@/store/slices/selectedItemsSlice';
import type { CardProps } from '@/types/';
import { classNames } from '@/utils/classNames';

function Card({
  currentPage,
  isSelected = false,
  item,
  onPokemonClick,
}: CardProps) {
  const dispatch = useAppDispatch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const isItemSelected = useAppSelector((state) =>
    selectIsItemSelected(state, item.id)
  );
  const imageUrls = useMemo(
    () =>
      [
        item.imageUrl,
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`,
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png`,
      ].filter(Boolean),
    [item.imageUrl, item.id]
  );

  const currentImageUrl = imageUrls[currentImageIndex];

  const handleImageError = () => {
    if (currentImageIndex < imageUrls.length - 1) {
      setCurrentImageIndex((previous) => previous + 1);
    } else {
      setImageError(true);
    }
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

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
    imageError,
    imageLoaded: !!currentImageUrl && !imageError,
    imageUrl: currentImageUrl,
    isItemSelected,
    isSelected,
    item,
    onCheckboxChange: handleCheckboxChange,
    onImageError: handleImageError,
    onImageLoad: handleImageLoad,
  };

  return onPokemonClick ? (
    <div
      className={classNames(baseClass, 'cursor-pointer')}
      onClick={handleClick}
    >
      <CardContent {...cardContentProps} />
    </div>
  ) : (
    <Link className={classNames(baseClass)} href={`/${currentPage}/${item.id}`}>
      <CardContent {...cardContentProps} />
    </Link>
  );
}

export default Card;
