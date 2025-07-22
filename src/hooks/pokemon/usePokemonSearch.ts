import { useState, useCallback } from "react"
// Fonction pour récupérer tous les Pokémon depuis une API ou un backend
import { fetchAllPokemon } from "@/features/pokemon/api/fetchAllPokemon"
// Type TypeScript pour s’assurer que chaque Pokémon a la bonne forme
import type { PokemonApiData } from "@/types/pokemon"

// Hook personnalisé pour la recherche de Pokémon par nom
export function usePokemonSearch() {
  // Etat local : résultats de la recherche (liste de Pokémon)
  const [results, setResults] = useState<PokemonApiData[]>([])
  // Etat local : booléen pour savoir si la recherche est en cours
  const [loading, setLoading] = useState(false)
  // Etat local : message d’erreur s’il y a un problème (null si aucun souci)
  const [error, setError] = useState<string | null>(null)

  // Fonction de recherche principale (mémorisée grâce à useCallback pour éviter les recréations inutiles)
  // Prend en paramètre la query (terme recherché) et un nombre maximum de résultats (par défaut 20)
  const search = useCallback(async (query: string, limit = 20) => {
    setLoading(true)   // On lance le loading
    setError(null)     // On efface toute ancienne erreur

    try {
      // On récupère tous les Pokémon (ici jusqu’à 200, pour éviter de charger 1000+ à chaque recherche)
      const allPokemon = await fetchAllPokemon(200)

      // On filtre pour ne garder que ceux dont le nom contient la query (insensible à la casse)
      const filtered = allPokemon
        .filter((pokemon) =>
          pokemon.name.toLowerCase().includes(query.toLowerCase())
        )
        // On limite le nombre de résultats pour l’autocomplétion
        .slice(0, limit)

      setResults(filtered) // On met à jour les résultats affichés
    } catch (e: any) {
      // En cas d’erreur réseau ou autre, on met un message d’erreur lisible
      setError(e.message || "Erreur inconnue")
    } finally {
      setLoading(false) // Fin du chargement, succès ou erreur
    }
  }, [])

  // On retourne toutes les infos utiles pour un composant : la liste, l’état de loading, d’erreur, et la fonction search
  return { results, loading, error, search }
}
