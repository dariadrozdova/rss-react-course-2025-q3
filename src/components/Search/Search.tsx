import { Component, type ChangeEvent } from 'react';
import styles from './Search.module.css';
import type { SearchProps, SearchState } from '../../types/types';

class Search extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    this.state = {
      inputValue: props.initialSearchTerm,
    };
  }

  componentDidUpdate(prevProps: SearchProps) {
    if (
      prevProps.initialSearchTerm !== this.props.initialSearchTerm &&
      this.props.initialSearchTerm !== this.state.inputValue
    ) {
      this.setState({ inputValue: this.props.initialSearchTerm });
    }
  }

  handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: event.target.value });
  };

  handleSearchClick = () => {
    const trimmedSearchTerm = this.state.inputValue.trim();
    this.props.onSearch(trimmedSearchTerm);
  };

  handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.handleSearchClick();
    }
  };

  render() {
    return (
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search for Pokemons..."
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyPress}
          className={styles.searchInput}
        />
        <button
          onClick={this.handleSearchClick}
          className={styles.searchButton}
        >
          Search
        </button>
      </div>
    );
  }
}

export default Search;
