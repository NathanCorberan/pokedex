"use client"

import { useState, useEffect } from "react"

const FAVORITES_KEY = "pokedex-favorites"

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Charger les favoris depuis localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY)
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Sauvegarder les favoris dans localStorage
  const saveFavorites = (newFavorites: number[]) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
      setFavorites(newFavorites)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des favoris:", error)
    }
  }

  // Ajouter un favori
  const addFavorite = (pokemonId: number) => {
    const newFavorites = [...favorites, pokemonId]
    saveFavorites(newFavorites)
  }

  // Supprimer un favori
  const removeFavorite = (pokemonId: number) => {
    const newFavorites = favorites.filter((id) => id !== pokemonId)
    saveFavorites(newFavorites)
  }

  // Basculer un favori
  const toggleFavorite = (pokemonId: number) => {
    if (favorites.includes(pokemonId)) {
      removeFavorite(pokemonId)
    } else {
      addFavorite(pokemonId)
    }
  }

  // Vérifier si un Pokémon est en favori
  const isFavorite = (pokemonId: number) => {
    return favorites.includes(pokemonId)
  }

  // Effacer tous les favoris
  const clearFavorites = () => {
    saveFavorites([])
  }

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    count: favorites.length,
  }
}
