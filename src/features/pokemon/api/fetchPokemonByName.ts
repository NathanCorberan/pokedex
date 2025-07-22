import type { PokemonApiData } from "@/types/pokemon"

// On construit l’URL de base de l’API Pokémon à partir des variables d’environnement (bonne pratique !)
const API_URL = import.meta.env.VITE_API_BASE_URL + '/pokemon'

// Fonction asynchrone qui va chercher un Pokémon précis par son nom (ex : "Pikachu")
// On retourne une promesse d’objet "PokemonApiData"
export async function fetchPokemonByName(name: string): Promise<PokemonApiData> {
  // On construit l’URL finale (on encode le nom pour éviter les bugs d’URL)
  const res = await fetch(`${API_URL}/${encodeURIComponent(name)}`)
  // Si le serveur ne répond pas OK (statut HTTP 2xx), on lève une erreur explicite
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokémon ${name}: ${res.status}`)
  }

  // On récupère la data JSON et on la retourne typée
  return await res.json()
}
