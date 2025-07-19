import styles from './CardList.module.css';
import type { CardListProps } from '../../types/types';
import Card from '../Card/Card';

function CardList(props: CardListProps) {
  const { pokemonItems } = props;

  return (
    <div className={styles.cardListContainer}>
      <ul className={styles.pokemonGrid}>
        {pokemonItems.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

export default CardList;
