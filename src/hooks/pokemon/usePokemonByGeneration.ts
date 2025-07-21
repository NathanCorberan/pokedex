import { useEffect, useState, useCallback } from "react";
import type { PokemonApiData } from "@/types/pokemon";
import { fetchPokemonByGeneration } from "@/features/pokemon/api/fetchPokemonByGeneration";

export function usePokemonByGeneration(generation?: number) {
  const [pokemon, setPokemon] = useState<PokemonApiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (generation === undefined) {
      setPokemon([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await fetchPokemonByGeneration(generation);
      setPokemon(result);
    } catch (e: any) {
      setError(e.message || "Erreur lors du chargement des Pokémon par génération");
    } finally {
      setLoading(false);
    }
  }, [generation]);

  useEffect(() => {
    load();
  }, [load]);

  return { pokemon, loading, error, refetch: load };
}
