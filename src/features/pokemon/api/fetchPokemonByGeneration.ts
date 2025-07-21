import type { PokemonApiData } from "@/types/pokemon";
import { fetchAllPokemon } from "./fetchAllPokemon";

export async function fetchPokemonByGeneration(generation: number): Promise<PokemonApiData[]> {
  const allPokemon = await fetchAllPokemon(400);
  const filtered = allPokemon.filter((pokemon) => pokemon.apiGeneration === generation);
  return filtered;
}
