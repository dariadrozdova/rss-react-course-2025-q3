import Image from 'next/image';

import { cn } from '@/utils/classNames';

interface PokemonDetailsContentProps {
  pokemon: {
    id: number;
    name: string;
    sprites: { front_default: null | string };
    stats: { base_stat: number; stat: { name: string } }[];
    types: { type: { name: string } }[];
  };
}

const PokemonDetailsContent = ({ pokemon }: PokemonDetailsContentProps) => (
  <>
    <div className={cn('text-center mb-6')}>
      {pokemon.sprites.front_default ? (
        <Image
          alt={pokemon.name}
          className={cn('mx-auto')}
          height={192}
          priority
          src={pokemon.sprites.front_default}
          width={192}
        />
      ) : (
        <div
          className={cn(
            'w-48 h-48 mx-auto flex items-center justify-center',
            'text-theme-secondary'
          )}
        >
          No image
        </div>
      )}
      <p className={cn('mt-2 text-theme-secondary')}>#{pokemon.id}</p>
    </div>

    <div className={cn('mb-6')}>
      <h3 className={cn('font-semibold mb-2 text-theme-primary')}>Types</h3>
      <div className={cn('flex gap-2')}>
        {pokemon.types.map((typeInfo, index) => (
          <span
            className={cn(
              'px-3 py-1 bg-blue-500 text-white rounded capitalize'
            )}
            key={index}
          >
            {typeInfo.type.name}
          </span>
        ))}
      </div>
    </div>

    <div>
      <h3 className={`font-semibold mb-2 text-theme-primary`}>Stats</h3>
      <div className={cn('space-y-2')}>
        {pokemon.stats.map((statInfo, index) => (
          <div className={cn('flex justify-between')} key={index}>
            <span className={cn('capitalize text-theme-text-light')}>
              {statInfo.stat.name}:
            </span>
            <span className={cn('font-bold text-theme-primary')}>
              {statInfo.base_stat}
            </span>
          </div>
        ))}
      </div>
    </div>
  </>
);

export default PokemonDetailsContent;
