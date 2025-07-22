import type { CardProps } from '../../types/types';

import styles from './Card.module.css';

function Card(props: CardProps) {
  const { item } = props;

  return (
    <li className={styles.pokemonCard} key={item.id}>
      <strong>{item.name}</strong>
      {item.imageUrl && (
        <img
          alt={item.name}
          className={styles.pokemonImage}
          src={item.imageUrl}
        />
      )}
    </li>
  );
}

export default Card;
