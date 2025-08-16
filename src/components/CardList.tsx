import Card from '@/components/Card/Card';
import type { CardListProps } from '@/types/';
import { cn } from '@/utils/classNames';

function CardList({
  currentPage,
  onPokemonClick,
  pokemonItems,
  selectedPokemonId,
}: CardListProps) {
  return (
    <div className={cn('w-full')}>
      <ul
        className={cn(`list-none p-4 m-0 grid w-full
          grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
          gap-4 sm:gap-5 md:gap-6`)}
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
