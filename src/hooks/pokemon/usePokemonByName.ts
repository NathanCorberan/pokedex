import { useEffect, useState, useCallback } from "react";
import { fetchPokemonByName } from "@/features/pokemon/api/fetchPokemonByName";
import type { PokemonApiData } from "@/types/pokemon";

export function usePokemonByName(name: string) {
  const [pokemon, setPokemon] = useState<PokemonApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchPokemonByName(name)
      .then(setPokemon)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [name]);

  useEffect(() => {
    load();
  }, [load]);

  return { pokemon, loading, error, refetch: load };
}
