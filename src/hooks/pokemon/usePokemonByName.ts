import { useEffect, useState, useCallback } from "react"
// Fonction pour aller chercher un Pokémon par son nom (API ou backend)
import { fetchPokemonByName } from "@/features/pokemon/api/fetchPokemonByName"
// Typage des données d’un Pokémon, version API
import type { PokemonApiData } from "@/types/pokemon"

// Hook personnalisé qui permet de charger un Pokémon à partir de son nom (ex: "Pikachu")
export function usePokemonByName(name: string) {
  // Etat local : le Pokémon trouvé (ou null si non trouvé)
  const [pokemon, setPokemon] = useState<PokemonApiData | null>(null)
  // Etat local : loading (affiche un spinner tant que la recherche est en cours)
  const [loading, setLoading] = useState(true)
  // Etat local : message d’erreur (null s’il n’y en a pas)
  const [error, setError] = useState<string | null>(null)

  // Fonction pour charger les données (recréée seulement si "name" change)
  // On la met dans useCallback pour garantir une identité stable (utile dans le useEffect !)
  const load = useCallback(() => {
    setLoading(true)      // On démarre le chargement
    setError(null)        // On efface l’ancienne erreur éventuelle

    // Appel à la fonction asynchrone pour récupérer le Pokémon
    fetchPokemonByName(name)
      .then(setPokemon)   // Si succès : on met à jour le Pokémon
      .catch((e) => setError(e.message)) // Si erreur : on affiche le message d’erreur
      .finally(() => setLoading(false))  // Dans tous les cas, on arrête le loading
  }, [name])

  // À chaque changement de "load" (donc de "name"), on recharge le Pokémon
  useEffect(() => {
    load()
  }, [load])

  // On expose la donnée, l’état de chargement, l’erreur, et une fonction pour relancer la requête à la demande
  return { pokemon, loading, error, refetch: load }
}
