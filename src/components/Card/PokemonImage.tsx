import { motion } from 'framer-motion';
import Image from 'next/image';

import { classNames } from '@/utils/classNames';

interface PokemonImageProps {
  imageError: boolean;
  imageLoaded: boolean;
  imageUrl: string | undefined;
  name: string;
  onImageError?: () => void;
  onImageLoad?: () => void;
}

function PokemonImage({
  imageError,
  imageLoaded,
  imageUrl,
  name,
  onImageError,
  onImageLoad,
}: PokemonImageProps) {
  const MotionImage = motion.create(Image);

  return (
    <div
      className={classNames('mt-4 relative', 'h-25 w-25', 'sm:h-30 sm:w-30')}
    >
      {!imageLoaded && !imageError && (
        <div
          className={classNames(
            'absolute inset-0 flex items-center justify-center',
            'rounded-lg bg-gray-200 animate-pulse'
          )}
        />
      )}
      {imageError || !imageUrl ? (
        <div
          className={classNames(
            'h-full w-full mx-auto',
            'flex items-center justify-center',
            'rounded-lg bg-gray-200 text-gray-500 text-sm'
          )}
        >
          No Image
        </div>
      ) : (
        <MotionImage
          alt={name}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          className={classNames(
            'block mx-auto rounded-lg h-auto',
            'max-w-25 sm:max-w-30'
          )}
          height={150}
          initial={{ opacity: 0 }}
          onError={onImageError}
          onLoad={onImageLoad}
          priority
          src={imageUrl}
          transition={{ duration: 0.5 }}
          width={150}
        />
      )}
    </div>
  );
}

export default PokemonImage;
