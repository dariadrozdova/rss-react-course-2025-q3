import Image from 'next/image';

import { classNames } from '@/utils/classNames';

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
    <div className={classNames('text-center mb-6')}>
      {pokemon.sprites.front_default ? (
        <Image
          alt={pokemon.name}
          className={classNames('mx-auto')}
          height={192}
          priority
          src={pokemon.sprites.front_default}
          width={192}
        />
      ) : (
        <div
          className={classNames(
            'w-48 h-48 mx-auto flex items-center justify-center',
            'text-theme-secondary'
          )}
        >
          No image
        </div>
      )}
      <p className={classNames('mt-2 text-theme-secondary')}>#{pokemon.id}</p>
    </div>

    <div className={classNames('mb-6')}>
      <h3 className={classNames('font-semibold mb-2 text-theme-primary')}>
        Types
      </h3>
      <div className={classNames('flex gap-2')}>
        {pokemon.types.map((typeInfo, index) => (
          <span
            className={classNames(
              'px-3 py-1 rounded capitalize',
              'bg-blue-500 text-white'
            )}
            key={index}
          >
            {typeInfo.type.name}
          </span>
        ))}
      </div>
    </div>

    <div>
      <h3 className={classNames('font-semibold mb-2 text-theme-primary')}>
        Stats
      </h3>
      <div className={classNames('space-y-2')}>
        {pokemon.stats.map((statInfo, index) => (
          <div className={classNames('flex justify-between')} key={index}>
            <span className={classNames('capitalize text-theme-text-light')}>
              {statInfo.stat.name}:
            </span>
            <span className={classNames('font-bold text-theme-primary')}>
              {statInfo.base_stat}
            </span>
          </div>
        ))}
      </div>
    </div>
  </>
);

export default PokemonDetailsContent;
