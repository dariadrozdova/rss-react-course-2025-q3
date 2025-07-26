import type { CardListProps } from '@types';

import Card from '@components/Card';

function CardList({
  currentPage,
  onPokemonClick,
  pokemonItems,
  selectedPokemonId,
}: CardListProps) {
  return (
    <div className="w-full box-border">
      <ul
        className="
          list-none p-0 m-0 grid w-full box-border
          grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-[15px]
          sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] sm:gap-5
          md:grid-cols-4 md:gap-[25px]
          lg:grid-cols-5 lg:gap-[25px]
        "
      >
        {pokemonItems.map((item) => (
          <Card
            currentPage={currentPage}
            isSelected={selectedPokemonId === item.id}
            item={item}
            key={item.id}
            {...(onPokemonClick ? { onPokemonClick } : {})}
          />
        ))}
      </ul>
    </div>
  );
}

export default CardList;
