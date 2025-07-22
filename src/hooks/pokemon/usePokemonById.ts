import { useEffect, useState, useCallback } from "react"
// Fonction pour aller chercher un Pokémon par son ID (depuis l'API ou le backend)
import { fetchPokemonById } from "@/features/pokemon/api/fetchPokemonById"
// Typage des données d’un Pokémon, version API
import type { PokemonApiData } from "@/types/pokemon"

// Hook personnalisé qui permet de charger un Pokémon à partir de son identifiant numérique
export function usePokemonById(id: number) {
  // Etat local : le Pokémon trouvé (ou null tant que rien n’est chargé)
  const [pokemon, setPokemon] = useState<PokemonApiData | null>(null)
  // Etat local : loading (pour spinner ou indiquer que la donnée arrive)
  const [loading, setLoading] = useState(true)
  // Etat local : message d’erreur (null si pas d’erreur)
  const [error, setError] = useState<string | null>(null)

  // Fonction de chargement des données (recréée uniquement si 'id' change)
  // useCallback permet d’avoir toujours la même référence pour le useEffect plus bas
  const load = useCallback(() => {
    setLoading(true)      // On passe en état loading
    setError(null)        // On efface toute erreur précédente

    // Appel à la fonction asynchrone pour récupérer le Pokémon
    fetchPokemonById(id)
      .then(setPokemon)                   // Si tout se passe bien, on stocke le Pokémon
      .catch((e) => setError(e.message))  // Sinon, on affiche l’erreur reçue
      .finally(() => setLoading(false))   // Fin du chargement dans tous les cas
  }, [id])

  // À chaque fois que 'load' change (donc que 'id' change), on recharge les données du Pokémon
  useEffect(() => {
    load()
  }, [load])

  // On retourne la donnée, le loading, l’erreur, et une fonction pour relancer le fetch à la demande
  return { pokemon, loading, error, refetch: load }
}
