import { useEffect, useState, useCallback } from "react"
// Typage des données de Pokémon (format API)
import type { PokemonApiData } from "@/types/pokemon"
// Fonction pour aller chercher tous les Pokémon d'une génération donnée (API)
import { fetchPokemonByGeneration } from "@/features/pokemon/api/fetchPokemonByGeneration"

// Hook personnalisé pour récupérer les Pokémon d’une génération précise (1, 2, 3, ...)
export function usePokemonByGeneration(generation?: number) {
  // Etat local : la liste des Pokémon (tableau vide par défaut)
  const [pokemon, setPokemon] = useState<PokemonApiData[]>([])
  // Etat local : booléen pour indiquer si le chargement est en cours
  const [loading, setLoading] = useState(true)
  // Etat local : message d’erreur, ou null s’il n’y a pas d’erreur
  const [error, setError] = useState<string | null>(null)

  // Fonction asynchrone qui charge les Pokémon d'une génération
  // On l’entoure d’un useCallback pour que sa référence soit stable (utile pour le useEffect)
  const load = useCallback(async () => {
    // Si aucune génération n’est sélectionnée (undefined), on vide la liste et on arrête le chargement
    if (generation === undefined) {
      setPokemon([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)   // On indique que le chargement commence
      setError(null)     // On efface toute ancienne erreur

      // On appelle la fonction qui va chercher tous les Pokémon de la génération
      const result = await fetchPokemonByGeneration(generation)
      setPokemon(result) // On stocke la liste reçue
    } catch (e: any) {
      // En cas d’erreur réseau, etc., on affiche le message
      setError(e.message || "Erreur lors du chargement des Pokémon par génération")
    } finally {
      setLoading(false) // On arrête le chargement quoi qu’il arrive
    }
  }, [generation])

  // Effet : recharge les Pokémon à chaque changement de génération (ou au montage)
  useEffect(() => {
    load()
  }, [load])

  // On expose la data, l’état de chargement, l’erreur et une fonction pour relancer la requête à la demande
  return { pokemon, loading, error, refetch: load }
}
