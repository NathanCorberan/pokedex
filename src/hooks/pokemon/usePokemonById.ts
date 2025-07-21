import { useEffect, useState, useCallback } from "react";
import { fetchPokemonById } from "@/features/pokemon/api/fetchPokemonById";
import type { PokemonApiData } from "@/types/pokemon";

export function usePokemonById(id: number) {
  const [pokemon, setPokemon] = useState<PokemonApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchPokemonById(id)
      .then(setPokemon)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { pokemon, loading, error, refetch: load };
}
