import type { PokemonApiData } from "@/types/pokemon"

// URL de base de l’API PokéBuild pour récupérer tous les Pokémon
const API_URL = import.meta.env.VITE_API_BASE_URL + `/pokemon`;
console.log(API_URL);

// Fonction asynchrone pour récupérer tous les Pokémon, avec option de limitation du nombre
export async function fetchAllPokemon(limit?: number): Promise<PokemonApiData[]> {
  // Si un "limit" est fourni, on construit l’URL avec ce paramètre (sinon, tous les Pokémon)
  const url = limit ? `${API_URL}/limit/${limit}` : API_URL

  // Appel HTTP GET sur l’API
  const res = await fetch(url)
  // Si la réponse n’est pas OK (statut 2xx), on lève une erreur explicite (gère tous les cas d’échec API)
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokémon: ${res.status}`)
  }

  // On retourne les données au format JSON, typées (tableau de PokemonApiData)
  return await res.json()
}
