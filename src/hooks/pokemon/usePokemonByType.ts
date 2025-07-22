import { useEffect, useState } from "react"
// Fonction qui va chercher la liste des Pokémon d'un certain type depuis l’API
import { fetchPokemonByType } from "@/features/pokemon/api/fetchPokemonByType"
// Type TypeScript qui définit la structure d’un Pokémon
import type { PokemonApiData } from "@/types/pokemon"

// Hook custom pour récupérer tous les Pokémon d’un type précis (ex : "Feu", "Eau", ...)
export function usePokemonByType(typeName: string) {
  // Etat local : liste des Pokémon récupérés pour ce type
  const [pokemon, setPokemon] = useState<PokemonApiData[]>([])
  // Etat local : loading pour afficher un spinner pendant le chargement
  const [loading, setLoading] = useState(true)
  // Etat local : message d’erreur s’il y a un souci réseau/serveur
  const [error, setError] = useState<string | null>(null)

  // Effet qui se relance à chaque fois que "typeName" change (ex : si on passe de "Feu" à "Eau")
  useEffect(() => {
    // Petite astuce : flag pour ignorer la mise à jour de l’état si le composant est démonté
    let isCancelled = false;

    // Fonction asynchrone pour charger les Pokémon du type demandé
    async function loadPokemon() {
      setLoading(true)   // On démarre le spinner
      setError(null)     // On efface toute ancienne erreur

      try {
        // On va chercher les Pokémon pour ce type (appel API)
        const data = await fetchPokemonByType(typeName)
        // Si le composant est toujours monté, on met à jour la liste
        if (!isCancelled) {
          setPokemon(data)
        }
      } catch (err) {
        // S’il y a une erreur, on met le message d’erreur
        if (!isCancelled) {
          setError("Erreur lors du chargement des Pokémon de ce type.")
        }
      } finally {
        // On arrête le loading (si le composant existe toujours)
        if (!isCancelled) setLoading(false)
      }
    }

    // On lance le chargement au montage ou quand typeName change
    loadPokemon();

    // Fonction de nettoyage : passe "isCancelled" à true quand le composant se démonte,
    // pour éviter de vouloir mettre à jour l’état d’un composant démonté (erreur React)
    return () => {
      isCancelled = true;
    };
  }, [typeName]) // Le hook s’actualise à chaque changement de type

  // On retourne un objet : la liste de Pokémon, le loading, et l’erreur éventuelle
  return { pokemon, loading, error }
}
