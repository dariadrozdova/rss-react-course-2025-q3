export interface Book {
  key: string; // Unique identifier for the book (e.g., "/works/OL12345W")
  title: string; // The title of the book
  author_name?: string[]; // An optional array of author names
  first_publish_year?: number; // The year the book was first published, optional
  cover_i?: number; // The ID for the cover image, used to construct the image URL, optional
}

// export interface MainPageProps extends Record<string, never> {}

export interface MainPageState {
  searchTerm: string; // Stores the current search input value (will be used later)
  books: Book[]; // Array to hold the fetched book data
  isLoading: boolean; // Flag to indicate if data is currently being fetched
  error: string | null; // Stores any error message, or null if no error
}

export interface SearchProps {
  onSearch: (searchTerm: string) => void;
  initialSearchTerm: string;
}

export interface SearchState {
  inputValue: string;
}
