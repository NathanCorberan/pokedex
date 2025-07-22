import { useEffect, useState, useCallback } from "react"
// Fonction pour récupérer tous les Pokémon (avec un nombre limite) depuis l’API
import { fetchAllPokemon } from "@/features/pokemon/api/fetchAllPokemon"
// Typage des données retournées pour chaque Pokémon (version API)
import type { PokemonApiData } from "@/types/pokemon"

// Hook personnalisé pour charger une liste de Pokémon (optionnellement limitée en nombre)
export function useAllPokemon(limit?: number) {
  // Etat local : la liste de Pokémon (tableau vide par défaut)
  const [pokemon, setPokemon] = useState<PokemonApiData[]>([])
  // Etat local : loading (spinner, skeleton...)
  const [loading, setLoading] = useState(true)
  // Etat local : message d’erreur en cas de souci réseau
  const [error, setError] = useState<string | null>(null)

  // Fonction qui lance le chargement (encapsulée dans useCallback pour stabilité)
  const load = useCallback(() => {
    setLoading(true)    // On démarre le chargement
    setError(null)      // On efface toute ancienne erreur
    fetchAllPokemon(limit)      // On appelle l’API pour récupérer les Pokémon (avec le limit si fourni)
      .then(setPokemon)         // Succès : on met à jour la liste
      .catch((e) => setError(e.message)) // Erreur : on stocke le message d’erreur
      .finally(() => setLoading(false))  // Dans tous les cas, on arrête le loading
  }, [limit]) // La fonction change si "limit" change

  // useEffect : lance le chargement à chaque fois que "load" change (donc que "limit" change aussi)
  useEffect(() => {
    load()
  }, [load])

  // On retourne la data, le loading, l’erreur, et une fonction pour relancer la requête
  return { pokemon, loading, error, refetch: load }
}
