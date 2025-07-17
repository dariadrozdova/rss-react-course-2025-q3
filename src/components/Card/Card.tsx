import { PureComponent } from 'react';
import styles from './Card.module.css';
import type { PokemonItem } from '../../types/types';

interface CardProps {
  item: PokemonItem;
}

class Card extends PureComponent<CardProps> {
  render() {
    const { item } = this.props;

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
}

export default Card;
