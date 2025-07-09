import { Component } from 'react';
import styles from './MainPage.module.css';
import type { MainPageState } from '../../types/types';

class MainPage extends Component<Record<string, never>, MainPageState> {
  constructor(props: Record<string, never>) {
    super(props);

    this.state = {
      searchTerm: '',
      books: [],
      isLoading: false,
      error: null,
    };
  }

  async componentDidMount() {
    this.fetchBooks('');
  }

  private async _handleHttpResponse(response: Response): Promise<Response> {
    if (!response.ok) {
      let errorMessage = `HTTP error! Status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (error) {
        console.error('Error fetching books:', error);
      }
      throw new Error(errorMessage);
    }
    return response;
  }

  fetchBooks = async (query: string) => {
    this.setState({ isLoading: true, error: null });

    const baseUrl = 'https://openlibrary.org/search.json';
    const limit = 20;
    const offset = 0;

    const actualQuery = query || 'the';

    const url = `${baseUrl}?q=${encodeURIComponent(actualQuery)}&limit=${limit}&offset=${offset}`;

    try {
      const response = await fetch(url);

      const validatedResponse = await this._handleHttpResponse(response);

      const data = await validatedResponse.json();

      this.setState({
        books: data.docs,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching books:', error);
      this.setState({
        error:
          error instanceof Error
            ? error.message
            : 'An unknown error occurred while fetching books.',
        isLoading: false,
      });
    }
  };

  render() {
    const { books, isLoading, error } = this.state;

    return (
      <div className={styles.mainPageContainer}>
        <section className={styles.topSection}>
          <h2>Top Controls</h2>
        </section>

        <section className={styles.resultsSection}>
          <h2>Search Results</h2>

          {isLoading && <p>Loading books...</p>}

          {error && <p className={styles.errorMessage}>Error: {error}</p>}

          {!isLoading && !error && books.length === 0 && (
            <p>No books found. Try a different search!</p>
          )}

          {!isLoading && !error && books.length > 0 && (
            <div>
              <h3>Displaying {books.length} Books:</h3>
              <ul>
                {books.map((book) => (
                  <li key={book.key}>
                    <strong>{book.title}</strong>
                    {book.author_name && ` by ${book.author_name.join(', ')}`}
                    {book.first_publish_year && ` (${book.first_publish_year})`}
                    {book.cover_i && (
                      <img
                        src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                        alt={`Cover of ${book.title}`}
                        style={{ width: '100px', marginLeft: '10px' }}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    );
  }
}

export default MainPage;
