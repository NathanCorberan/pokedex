import { useEffect, useState, useCallback } from "react";
import { fetchAllPokemon } from "@/features/pokemon/api/fetchAllPokemon";
import type { PokemonApiData } from "@/types/pokemon";

export function useAllPokemon(limit?: number) {
  const [pokemon, setPokemon] = useState<PokemonApiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchAllPokemon(limit)
      .then(setPokemon)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [limit]);

  useEffect(() => {
    load();
  }, [load]);

  return { pokemon, loading, error, refetch: load };
}
