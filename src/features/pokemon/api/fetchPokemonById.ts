import type { PokemonApiData } from "@/types/pokemon"

// Fonction asynchrone pour récupérer un Pokémon par son ID
// On peut passer un nombre ou une string (l’API accepte les deux)
// Retour : soit l’objet PokemonApiData, soit null si échec
export async function fetchPokemonById(id: number | string): Promise<PokemonApiData | null> {
  try {
    // On lance la requête vers l’API (URL officielle PokéBuildAPI)
    const API_URL = import.meta.env.VITE_API_BASE_URL + `/pokemon/${id}`;
    const res = await fetch(API_URL)

    // Si le statut HTTP n’est pas OK (pas de Pokémon, ou erreur serveur), on log et on retourne null
    if (!res.ok) {
      console.error(`Erreur ${res.status} pour le Pokémon ID ${id}`)
      return null
    }

    // On vérifie que la réponse est bien du JSON (sécurité contre les mauvaises surprises d’API)
    const contentType = res.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Mauvais content-type. Reçu :", contentType)
      return null
    }

    // On récupère et retourne la data JSON (tipée comme PokemonApiData)
    const data = await res.json()
    return data
  } catch (err) {
    // Si une erreur réseau/JS survient (pas juste un statut API), on log et on retourne null
    console.error("fetchPokemonById failed:", err)
    return null
  }
}
