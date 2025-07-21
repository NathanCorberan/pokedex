import { useState, useCallback } from "react";
import { fetchAllPokemon } from "@/features/pokemon/api/fetchAllPokemon";
import type { PokemonApiData } from "@/types/pokemon";

export function usePokemonSearch() {
  const [results, setResults] = useState<PokemonApiData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, limit = 20) => {
    setLoading(true);
    setError(null);

    try {
      const allPokemon = await fetchAllPokemon(200);
      const filtered = allPokemon
        .filter((pokemon) =>
          pokemon.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, limit);

      setResults(filtered);
    } catch (e: any) {
      setError(e.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
}
