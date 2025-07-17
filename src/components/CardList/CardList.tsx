import { PureComponent } from 'react';
import styles from './CardList.module.css';
import type { PokemonItem } from '../../types/types';
import Card from '../Card/Card';

interface CardListProps {
  pokemonItems: PokemonItem[];
}

class CardList extends PureComponent<CardListProps> {
  render() {
    const { pokemonItems } = this.props;

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
}

export default CardList;
