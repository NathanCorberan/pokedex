import { useEffect, useState, useCallback } from "react"
// Fonction pour récupérer tous les types de Pokémon depuis l'API ou le backend
import { fetchAllTypes } from "@/features/pokemon/api/fetchAllTypes"
// Typage des données d’un type de Pokémon, version API
import type { TypeApiData } from "@/types/pokemon"

// Hook personnalisé pour charger la liste de tous les types de Pokémon
export function useAllTypes() {
  // Etat local : tableau des types récupérés depuis l'API (vide au départ)
  const [types, setTypes] = useState<TypeApiData[]>([])
  // Etat local : booléen pour savoir si le chargement est en cours (spinner)
  const [loading, setLoading] = useState(true)
  // Etat local : message d’erreur, ou null s’il n’y en a pas
  const [error, setError] = useState<string | null>(null)

  // Fonction qui charge les types, encapsulée dans un useCallback pour garantir une référence stable (utile pour useEffect)
  const load = useCallback(() => {
    setLoading(true)   // On démarre le chargement
    setError(null)     // On efface toute ancienne erreur
    // On lance l'appel API pour tous les types
    fetchAllTypes()
      .then(setTypes)                  // Si succès : on stocke la liste reçue
      .catch((e) => setError(e.message)) // Si erreur : on affiche le message
      .finally(() => setLoading(false))  // Dans tous les cas, on arrête le loading
  }, []) // Le tableau vide garantit que "load" ne change jamais de référence (sauf au montage)

  // A chaque fois que "load" change (ici : jamais), on recharge les types au montage du composant
  useEffect(() => {
    load()
  }, [load])

  // On expose la data, le loading, l’erreur, et une fonction pour relancer la requête à la demande
  return { types, loading, error, refetch: load }
}
