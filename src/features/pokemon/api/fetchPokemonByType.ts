import type { PokemonApiData } from "@/types/pokemon"

// Fonction asynchrone pour récupérer la liste des Pokémon d’un type donné (ex: "Feu", "Eau"…)
// On retourne un tableau de Pokémon (PokemonApiData[]), ou une erreur si l’API échoue.
export async function fetchPokemonByType(typeName: string): Promise<PokemonApiData[]> {
  // On construit l’URL de l’API avec le type passé en paramètre, en le passant en minuscule et encodé pour l’URL
  // (encodeURIComponent gère les accents/espaces)
  const API_URL = import.meta.env.VITE_API_BASE_URL + `/pokemon/type/${encodeURIComponent(typeName.toLowerCase())}`;
  // Log pour debug : on affiche le type et l’URL appelée
  console.log(`Fetching Pokémon for type: ${typeName}`, API_URL);

  // On appelle l’API (fetch est asynchrone, on attend la réponse)
  const res = await fetch(API_URL);
  // Si l’API répond avec un code d’erreur (pas 2xx), on lève une exception
  if (!res.ok) {
    throw new Error(`Erreur lors du chargement du type ${typeName} : ${res.status}`);
  }

  // On récupère la réponse (au format JSON) et on la typpe comme un tableau de Pokémon
  const data: PokemonApiData[] = await res.json();
  // Log de debug : on affiche les données reçues
  console.log("API response:", data);
  // On retourne les données au caller (souvent un hook ou un composant)
  return data;
}
