import type { PokemonApiData } from "@/types/pokemon";

const API_URL = "https://pokebuildapi.fr/api/v1/pokemon";

export async function fetchAllPokemon(limit?: number): Promise<PokemonApiData[]> {
  const url = limit ? `${API_URL}/limit/${limit}` : API_URL;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokémon: ${res.status}`);
  }

  return await res.json();
}
