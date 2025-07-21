import type { PokemonApiData } from "@/types/pokemon";

const API_URL = import.meta.env.VITE_API_URL + "/pokemon";

export async function fetchPokemonByName(name: string): Promise<PokemonApiData> {
  const res = await fetch(`${API_URL}/${encodeURIComponent(name)}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokémon ${name}: ${res.status}`);
  }

  return await res.json();
}
