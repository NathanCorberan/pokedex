import type { PokemonApiData } from "@/types/pokemon"
// On importe la fonction qui va chercher tous les Pokémon (jusqu’à 400 par défaut ici)
import { fetchAllPokemon } from "./fetchAllPokemon"

// Fonction asynchrone pour récupérer les Pokémon d’une génération précise
export async function fetchPokemonByGeneration(generation: number): Promise<PokemonApiData[]> {
  // On récupère la liste complète des Pokémon (400 max, mais tu peux ajuster si besoin)
  const allPokemon = await fetchAllPokemon(400)
  // On filtre les Pokémon qui appartiennent à la génération demandée
  const filtered = allPokemon.filter((pokemon) => pokemon.apiGeneration === generation)
  // On retourne uniquement ceux de cette génération
  return filtered
}
