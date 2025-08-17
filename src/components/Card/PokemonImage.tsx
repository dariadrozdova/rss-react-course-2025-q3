import Image from 'next/image';

import { classNames } from '@/utils/classNames';

interface PokemonImageProps {
  imageError: boolean;
  imageLoaded: boolean;
  imageUrl: string | undefined;
  name: string;
}

function PokemonImage({ imageUrl, name }: PokemonImageProps) {
  return (
    <div
      className={classNames('mt-4 relative', 'h-25 w-25', 'sm:h-30 sm:w-30')}
    >
      {imageUrl ? (
        <Image
          alt={name}
          className={classNames(
            'block mx-auto rounded-lg h-auto',
            'max-w-25 sm:max-w-30'
          )}
          height={150}
          src={imageUrl}
          width={150}
        />
      ) : (
        <div
          className={classNames(
            'h-full w-full mx-auto',
            'flex items-center justify-center',
            'rounded-lg bg-gray-200 text-gray-500 text-sm'
          )}
        >
          No Image
        </div>
      )}
    </div>
  );
}

export default PokemonImage;
