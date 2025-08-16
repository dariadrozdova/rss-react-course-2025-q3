import { motion } from 'framer-motion';
import Image from 'next/image';

import { cn } from '@/utils/classNames';

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
      className={cn(
        'mt-4 relative h-[100px] sm:h-[120px] w-[100px] sm:w-[120px]'
      )}
    >
      {!imageLoaded && !imageError && (
        <div
          className={cn(
            'absolute inset-0 rounded-lg bg-gray-200 animate-pulse flex items-center justify-center'
          )}
        />
      )}
      {imageError || !imageUrl ? (
        <div
          className={cn(
            'rounded-lg h-full w-full bg-gray-200 flex items-center justify-center mx-auto text-gray-500 text-sm'
          )}
        >
          No Image
        </div>
      ) : (
        <MotionImage
          alt={name}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          className={cn(
            'rounded-lg h-auto block max-w-[100px] sm:max-w-[120px] mx-auto'
          )}
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
