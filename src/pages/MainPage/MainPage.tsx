import { Component } from 'react';
import styles from './MainPage.module.css';
import type { MainPageState, PokemonItem } from '../../types/types';
import Search from '../../components/Search/Search';

class MainPage extends Component<Record<string, never>, MainPageState> {
  private readonly LOCAL_STORAGE_SEARCH_TERM_KEY = 'lastSearchTerm';

  constructor(props: Record<string, never>) {
    super(props);

    const initialSearchTerm =
      localStorage.getItem(this.LOCAL_STORAGE_SEARCH_TERM_KEY) || '';

    this.state = {
      searchTerm: initialSearchTerm,
      pokemonItems: [],
      isLoading: false,
      error: null,
      throwError: false,
    };
  }

  async componentDidMount() {
    await this.fetchPokemonItems(this.state.searchTerm).catch((error) =>
      console.error('Error during initial fetch:', error)
    );
  }

  private async _handleHttpResponse(response: Response): Promise<Response> {
    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      throw new Error(errorMessage);
    }
    return response;
  }

  fetchPokemonItems = async (query: string) => {
    this.setState({ isLoading: true, error: null });

    const baseUrl = 'https://pokeapi.co/api/v2/pokemon/';
    const limit = 20;
    const offset = 0;

    const url = `${baseUrl}?limit=${limit}&offset=${offset}`;

    try {
      const response = await fetch(url);
      const validatedResponse = await this._handleHttpResponse(response);
      const data = await validatedResponse.json();

      let filteredItems = data.results;

      if (query) {
        const lowerCaseQuery = query.toLowerCase();
        filteredItems = data.results.filter(
          (item: { name: string; url: string }) =>
            item.name.toLowerCase().includes(lowerCaseQuery)
        );
      }

      const itemsWithDetails: PokemonItem[] = await Promise.all(
        filteredItems.map(async (item: { name: string; url: string }) => {
          const detailResponse = await fetch(item.url);
          const verifiedResponse =
            await this._handleHttpResponse(detailResponse);
          const detailData = await verifiedResponse.json();

          return {
            name: item.name,
            url: item.url,
            imageUrl: detailData.sprites.front_default,
            id: detailData.id,
          };
        })
      );

      this.setState({
        pokemonItems: itemsWithDetails,
        isLoading: false,
      });

      localStorage.setItem(this.LOCAL_STORAGE_SEARCH_TERM_KEY, query);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
      this.setState({
        error:
          error instanceof Error
            ? error.message
            : 'An unknown error occurred while fetching Pokemon.',
        isLoading: false,
      });
    }
  };

  handleSearch = (searchTerm: string) => {
    if (searchTerm !== this.state.searchTerm) {
      this.setState({ searchTerm }, () => {
        void this.fetchPokemonItems(searchTerm).catch((error) =>
          console.error('Error during search fetch:', error)
        );
      });
    }
  };

  throwTestError = () => {
    this.setState({ throwError: true });
    throw new Error('This is a test error thrown from MainPage!');
  };

  render() {
    const { pokemonItems, isLoading, error, searchTerm } = this.state;

    if (this.state.throwError) {
      throw new Error('This is a test error thrown from the render method!');
    }

    return (
      <div className={styles.mainPageContainer}>
        <section className={styles.topSection}>
          <Search initialSearchTerm={searchTerm} onSearch={this.handleSearch} />
        </section>

        <section className={styles.resultsSection}>
          {isLoading && (
            <div className={styles.loaderContainer}>
              <div className={styles.spinner}></div>
              <p>Loading Pokemon...</p>
            </div>
          )}

          {error && <p className={styles.errorMessage}>Error: {error}</p>}

          {!isLoading && !error && pokemonItems.length === 0 && (
            <p>No Pokemon found. Try a different search!</p>
          )}

          {!isLoading && !error && pokemonItems.length > 0 && (
            <div>
              <ul className={styles.pokemonGrid}>
                {pokemonItems.map((item) => (
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
                ))}
              </ul>
            </div>
          )}
        </section>

        <button
          onClick={this.throwTestError}
          className={styles.errorTestButton}
        >
          Throw Test Error
        </button>
      </div>
    );
  }
}

export default MainPage;
