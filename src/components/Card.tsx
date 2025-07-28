import type { CardProps } from '@types';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useTheme } from '@/context/ThemeContext';

function Card({
  currentPage,
  isSelected = false,
  item,
  onPokemonClick,
}: CardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isDark } = useTheme();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPokemonClick) {
      e.preventDefault();
      onPokemonClick(item.id);
    }
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

  const cardContent = (
    <>
      <strong
        className={`
          mb-2.5 capitalize font-bold text-base md:text-lg transition-colors
          ${
            isSelected
              ? 'text-teal-600'
              : isDark
                ? 'text-gray-100 group-hover:text-teal-400'
                : 'text-gray-800 group-hover:text-teal-600'
          }
        `}
      >
        {item.name}
      </strong>

      <div className="mt-4 relative h-[100px] sm:h-[120px] w-[100px] sm:w-[120px]">
        {' '}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 rounded-lg bg-gray-200 animate-pulse flex items-center justify-center" />
        )}
        {imageError ? (
          <div className="rounded-lg h-full w-full bg-gray-200 flex items-center justify-center mx-auto text-gray-500 text-sm">
            No Image
          </div>
        ) : (
          <motion.img
            alt={item.name}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            className={`rounded-lg h-auto block max-w-[100px] sm:max-w-[120px] mx-auto ${imageLoaded ? '' : 'hidden'}`}
            height={150}
            initial={{ opacity: 0 }}
            onError={handleImageError}
            onLoad={handleImageLoad}
            src={imageUrl}
            transition={{ duration: 0.5 }}
            width={150}
          />
        )}
      </div>
    </>
  );

  const baseClass = `
    group p-4 sm:p-5 rounded-lg shadow-sm flex flex-col items-center text-center
    transition-all duration-300 ease-in-out h-[240px] border
    ${isDark ? 'bg-gray-800' : 'bg-white'}
    ${
      isSelected
        ? 'border-teal-400 shadow-lg ring-2 ring-teal-200 -translate-y-1'
        : isDark
          ? 'border-gray-600 hover:-translate-y-1 hover:shadow-lg hover:border-teal-400'
          : 'border-gray-200 hover:-translate-y-1 hover:shadow-lg hover:border-teal-400'
    }
  `;

  return onPokemonClick ? (
    <div className={baseClass + ' cursor-pointer'} onClick={handleClick}>
      {cardContent}
    </div>
  ) : (
    <Link className={baseClass} to={`/${currentPage}/${item.id}`}>
      {cardContent}
    </Link>
  );
}

export default Card;
