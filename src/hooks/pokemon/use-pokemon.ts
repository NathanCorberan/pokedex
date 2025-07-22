import { useEffect, useState, useCallback } from "react"
// Fonction qui va chercher tous les Pokémon (optionnellement limitée en nombre)
import { fetchAllPokemon } from "@/features/pokemon/api/fetchAllPokemon"
// Type TypeScript qui décrit la forme d’un Pokémon reçu depuis l’API
import type { PokemonApiData } from "@/types/pokemon"

// Hook custom pour charger une liste de Pokémon, limité ou non par "limit"
export function useAllPokemon(limit?: number) {
  // Etat local : le tableau de tous les Pokémon chargés (vide au départ)
  const [pokemon, setPokemon] = useState<PokemonApiData[]>([])
  // Etat local : vrai tant que la requête de chargement est en cours
  const [loading, setLoading] = useState(true)
  // Etat local : message d’erreur si la requête échoue, sinon null
  const [error, setError] = useState<string | null>(null)

  // Fonction utilitaire pour lancer la requête, encapsulée dans useCallback pour
  // garantir que sa référence ne change que si "limit" change (bonne pratique avec useEffect)
  const load = useCallback(() => {
    setLoading(true)       // On passe en mode chargement
    setError(null)         // On efface toute ancienne erreur
    fetchAllPokemon(limit) // On appelle l’API (param "limit" = max Pokémon à charger)
      .then(setPokemon)    // Si ça réussit : on stocke la liste dans l’état
      .catch((e) => setError(e.message)) // Si ça échoue : on affiche l’erreur
      .finally(() => setLoading(false))  // On arrête le spinner/chargement dans tous les cas
  }, [limit])

  // On lance "load" à chaque fois que "limit" change (ou au tout premier rendu)
  useEffect(() => {
    load()
  }, [load])

  // On retourne tout ce qu’un composant peut vouloir utiliser
  // - la liste de Pokémon, l’état de loading, l’erreur éventuelle, et la possibilité de relancer (refetch)
  return { pokemon, loading, error, refetch: load }
}
