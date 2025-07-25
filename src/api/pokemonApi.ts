import type {
  PokemonDetailResponse,
  PokemonItem,
  PokemonListItem,
  PokemonListResponse,
} from '@types';

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/';

const handleHttpResponse = async (response: Response): Promise<Response> => {
  if (!response.ok) {
    let errorMessage = `HTTP error! Status: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch (parseError) {
      console.warn('Failed to parse error response:', parseError);
    }
    throw new Error(errorMessage);
  }
  return response;
};

export const fetchPokemonList = async (
  offset: number,
  limit: number
): Promise<{ results: PokemonListItem[]; total: number }> => {
  try {
    const listUrl = `${BASE_URL}?limit=${limit}&offset=${offset}`;
    const response = await fetch(listUrl);
    const validatedResponse = await handleHttpResponse(response);
    const data: PokemonListResponse = await validatedResponse.json();

    return {
      results: data.results,
      total: data.count,
    };
  } catch (error) {
    console.warn('Error in fetchPokemonList (basic list):', error);
    throw error;
  }
};

export const fetchPokemonDetails = async (
  url: string
): Promise<PokemonItem> => {
  try {
    const detailResponse = await fetch(url);
    const verifiedResponse = await handleHttpResponse(detailResponse);
    const detailData: PokemonDetailResponse = await verifiedResponse.json();

    return {
      id: detailData.id,
      imageUrl: detailData.sprites.front_default || undefined,
      name: detailData.name,
      url: url,
    };
  } catch (error) {
    console.warn(`Could not fetch details for ${url}:`, error);
    throw error;
  }
};
