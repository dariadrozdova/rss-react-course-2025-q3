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
    <div className="text-center mb-6">
      {pokemon.sprites.front_default ? (
        <img
          alt={pokemon.name}
          className="w-48 h-48 mx-auto"
          src={pokemon.sprites.front_default}
        />
      ) : (
        <div
          className={`w-48 h-48 mx-auto flex items-center justify-center bg-theme-image-placeholder text-theme-secondary`}
        >
          No image
        </div>
      )}
      <p className={`mt-2 text-theme-secondary`}>#{pokemon.id}</p>
    </div>

    <div className="mb-6">
      <h3 className={`font-semibold mb-2 text-theme-primary`}>Types</h3>
      <div className="flex gap-2">
        {pokemon.types.map((typeInfo, index) => (
          <span
            className="px-3 py-1 bg-blue-500 text-white rounded capitalize"
            key={index}
          >
            {typeInfo.type.name}
          </span>
        ))}
      </div>
    </div>

    <div>
      <h3 className={`font-semibold mb-2 text-theme-primary`}>Stats</h3>
      <div className="space-y-2">
        {pokemon.stats.map((statInfo, index) => (
          <div className="flex justify-between" key={index}>
            <span className={`capitalize text-theme-text-light`}>
              {statInfo.stat.name}:
            </span>
            <span className={`font-bold text-theme-primary`}>
              {statInfo.base_stat}
            </span>
          </div>
        ))}
      </div>
    </div>
  </>
);

export default PokemonDetailsContent;
