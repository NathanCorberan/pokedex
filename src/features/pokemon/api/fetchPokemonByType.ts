import type { PokemonApiData } from "@/types/pokemon";

export async function fetchPokemonByType(typeName: string): Promise<PokemonApiData[]> {
  const API_URL = `https://pokebuildapi.fr/api/v1/pokemon/type/${encodeURIComponent(typeName.toLowerCase())}`;
  console.log(`Fetching Pokémon for type: ${typeName}`, API_URL);

  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`Erreur lors du chargement du type ${typeName} : ${res.status}`);
  }

  const data: PokemonApiData[] = await res.json();
  console.log("API response:", data);
  return data;
}
