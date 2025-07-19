import styles from './Card.module.css';
import type { CardProps } from '../../types/types';

function Card(props: CardProps) {
  const { item } = props;

  return (
    <li key={item.id} className={styles.pokemonCard}>
      <strong>{item.name}</strong>
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          className={styles.pokemonImage}
        />
      )}
    </li>
  );
}

export default Card;
