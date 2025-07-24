import type { CardListProps } from '@types';

import Card from '@components/Card';

function CardList(props: CardListProps) {
  const { pokemonItems } = props;

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
          <Card item={item} key={item.id} />
        ))}
      </ul>
    </div>
  );
}

export default CardList;
