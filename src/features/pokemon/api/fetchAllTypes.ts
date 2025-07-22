import type { TypeApiData } from "@/types/pokemon"

// URL de l’API pour récupérer la liste des types de Pokémon
  const API_URL = import.meta.env.VITE_API_BASE_URL + `/types`;


// Fonction asynchrone qui va chercher tous les types de Pokémon depuis l’API PokéBuild
export async function fetchAllTypes(): Promise<TypeApiData[]> {
  // On effectue la requête HTTP GET
  const res = await fetch(API_URL)
  // Si l’API répond avec un code d’erreur, on lève une exception explicite
  if (!res.ok) {
    throw new Error(`Failed to fetch types: ${res.status}`)
  }
  // On récupère la data JSON et on la retourne
  return await res.json()
}
