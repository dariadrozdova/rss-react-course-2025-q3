import React from 'react';

import { motion } from 'framer-motion';

interface PokemonImageProps {
  imageError: boolean;
  imageLoaded: boolean;
  imageUrl: string;
  name: string;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onImageLoad: () => void;
}

function PokemonImage({
  imageError,
  imageLoaded,
  imageUrl,
  name,
  onImageError,
  onImageLoad,
}: PokemonImageProps) {
  return (
    <div className="mt-4 relative h-[100px] sm:h-[120px] w-[100px] sm:w-[120px]">
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 rounded-lg bg-gray-200 animate-pulse flex items-center justify-center" />
      )}
      {imageError ? (
        <div className="rounded-lg h-full w-full bg-gray-200 flex items-center justify-center mx-auto text-gray-500 text-sm">
          No Image
        </div>
      ) : (
        <motion.img
          alt={name}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          className={`rounded-lg h-auto block max-w-[100px] sm:max-w-[120px] mx-auto ${imageLoaded ? '' : 'hidden'}`}
          height={150}
          initial={{ opacity: 0 }}
          onError={onImageError}
          onLoad={onImageLoad}
          src={imageUrl}
          transition={{ duration: 0.5 }}
          width={150}
        />
      )}
    </div>
  );
}

export default PokemonImage;
