import type {
  PokemonDetailResponse,
  PokemonItem,
  PokemonListResponse,
} from '../types/types';

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';
const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

const handleHttpResponse = async (response: Response): Promise<Response> => {
  if (!response.ok) {
    let errorMessage = `HTTP error! Status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch (error_) {
      console.warn('Failed to parse error response:', error_);
    }
    throw new Error(errorMessage);
  }
  return response;
};

export const fetchPokemonList = async (
  query: string = '',
  limit: number = DEFAULT_LIMIT,
  offset: number = DEFAULT_OFFSET
): Promise<PokemonItem[]> => {
  const url = `${BASE_URL}?limit=${limit}&offset=${offset}`;

  try {
    const response = await fetch(url);
    const validatedResponse = await handleHttpResponse(response);
    const data: PokemonListResponse = await validatedResponse.json();

    let filteredItems = data.results;

    if (query) {
      const lowerCaseQuery = query.toLowerCase();
      filteredItems = data.results.filter((item) =>
        item.name.toLowerCase().includes(lowerCaseQuery)
      );

      if (filteredItems.length === 0) {
        try {
          const singlePokemonResponse = await fetch(
            `${BASE_URL}${lowerCaseQuery}/`
          );
          const validatedSingleResponse = await handleHttpResponse(
            singlePokemonResponse
          );
          const singlePokemonData: PokemonDetailResponse =
            await validatedSingleResponse.json();
          filteredItems = [
            {
              name: singlePokemonData.name,
              url: `${BASE_URL}${singlePokemonData.name}/`,
            },
          ];
        } catch {
          console.warn(
            `No direct match for "${query}", and list filter yielded no results.`
          );
          return [];
        }
      }
    }

    if (filteredItems.length === 0) {
      return [];
    }

    const itemsWithDetails: PokemonItem[] = await Promise.all(
      filteredItems.map(async (item) => {
        const detailResponse = await fetch(item.url);
        const verifiedResponse = await handleHttpResponse(detailResponse);
        const detailData: PokemonDetailResponse = await verifiedResponse.json();

        return {
          id: detailData.id,
          imageUrl: detailData.sprites.front_default,
          name: item.name,
          url: item.url,
        };
      })
    );
    return itemsWithDetails;
  } catch (error) {
    console.warn('Error fetching Pokemon list or details:', error);
    throw error;
  }
};
