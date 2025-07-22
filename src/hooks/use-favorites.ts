// "use client" indique à Next.js ou Remix d'exécuter ce fichier côté client (utile dans certains frameworks)
"use client"

import { useState, useEffect } from "react"

// Nom de la clé utilisée dans localStorage pour stocker les favoris
const FAVORITES_KEY = "pokedex-favorites"

// Hook personnalisé pour gérer la liste des Pokémon favoris dans l'app
export function useFavorites() {
  // Etat local : tableau d'ID des Pokémon favoris
  const [favorites, setFavorites] = useState<number[]>([])
  // Etat local pour savoir si les favoris sont en cours de chargement (pour éviter un flash)
  const [isLoading, setIsLoading] = useState(true)

  // --- 1. CHARGER LES FAVORIS AU MONTAGE ---
  useEffect(() => {
    try {
      // On lit la valeur du localStorage
      const stored = localStorage.getItem(FAVORITES_KEY)
      // Si trouvé, on parse (string → tableau)
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error)
    } finally {
      // Quoi qu'il arrive, le chargement est terminé
      setIsLoading(false)
    }
  }, [])

  // --- 2. SAUVEGARDER LES FAVORIS DANS LE LOCALSTORAGE ---
  // Fonction utilitaire pour stocker et mettre à jour l'état local en même temps
  const saveFavorites = (newFavorites: number[]) => {
    try {
      // On stocke la nouvelle liste (tableau → string)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
      // On met à jour l'état local
      setFavorites(newFavorites)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des favoris:", error)
    }
  }

  // --- 3. AJOUTER UN FAVORI ---
  const addFavorite = (pokemonId: number) => {
    // On ajoute l'ID à la liste courante (pas de vérif double ici)
    const newFavorites = [...favorites, pokemonId]
    saveFavorites(newFavorites)
  }

  // --- 4. SUPPRIMER UN FAVORI ---
  const removeFavorite = (pokemonId: number) => {
    // On enlève l'ID demandé de la liste
    const newFavorites = favorites.filter((id) => id !== pokemonId)
    saveFavorites(newFavorites)
  }

  // --- 5. BASCULER FAVORI (si dedans → retire, sinon → ajoute) ---
  const toggleFavorite = (pokemonId: number) => {
    if (favorites.includes(pokemonId)) {
      removeFavorite(pokemonId)
    } else {
      addFavorite(pokemonId)
    }
  }

  // --- 6. VÉRIFIER SI UN POKÉMON EST EN FAVORI ---
  const isFavorite = (pokemonId: number) => {
    return favorites.includes(pokemonId)
  }

  // --- 7. TOUT SUPPRIMER ---
  const clearFavorites = () => {
    saveFavorites([])
  }

  // --- 8. VALEURS ET FONCTIONS EXPOSÉES PAR LE HOOK ---
  return {
    favorites,         // La liste des favoris
    isLoading,         // Etat de chargement
    addFavorite,       // Ajouter
    removeFavorite,    // Enlever
    toggleFavorite,    // Basculer
    isFavorite,        // Savoir si un Pokémon est déjà en favori
    clearFavorites,    // Tout effacer
    count: favorites.length, // Nombre de favoris
  }
}
