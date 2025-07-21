import { useEffect, useState } from "react";
import { fetchPokemonByType } from "@/features/pokemon/api/fetchPokemonByType";
import type { PokemonApiData } from "@/types/pokemon";

export function usePokemonByType(typeName: string) {
  const [pokemon, setPokemon] = useState<PokemonApiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadPokemon() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPokemonByType(typeName);
        if (!isCancelled) {
          setPokemon(data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError("Erreur lors du chargement des Pokémon de ce type.");
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadPokemon();

    return () => {
      isCancelled = true;
    };
  }, [typeName]);

  return { pokemon, loading, error };
}
