import type { CardListProps } from '../../types/types';
import Card from '../Card/Card';

import styles from './CardList.module.css';

function CardList(props: CardListProps) {
  const { pokemonItems } = props;

  return (
    <div className={styles.cardListContainer}>
      <ul className={styles.pokemonGrid}>
        {pokemonItems.map((item) => (
          <Card item={item} key={item.id} />
        ))}
      </ul>
    </div>
  );
}

export default CardList;
