import { useState, useEffect } from "react";
import { PokemonCard } from "./pokemon-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { PokemonApiData } from "@/types/pokemon";

import { useAllPokemon } from "@/hooks/pokemon/useAllPokemon";
import { usePokemonByGeneration } from "@/hooks/pokemon/usePokemonByGeneration";

interface PokemonGridProps {
  selectedType: string;
  selectedGeneration: string;
}

export function PokemonGrid({ selectedType, selectedGeneration }: PokemonGridProps) {
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonApiData[]>([]);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const genNumber = Number(selectedGeneration);
  const { pokemon: allPokemon, loading: loadingAll, error: errorAll, refetch: refetchAll } = useAllPokemon(400);
  const { pokemon: byGen, loading: loadingGen, error: errorGen } = usePokemonByGeneration(isNaN(genNumber) ? undefined : genNumber);

  const loading = loadingAll || loadingGen;
  const error = errorAll || errorGen;

  useEffect(() => {
    let result = allPokemon;

    if (selectedType) {
      result = result.filter((p) =>
        p.apiTypes.some((t) => t.name.toLowerCase() === selectedType.toLowerCase())
      );
    }

    if (selectedGeneration && !isNaN(genNumber)) {
      result = result.filter((p) => p.apiGeneration === genNumber);
    }

    setFilteredPokemon(result);
    setPage(1);
  }, [selectedType, selectedGeneration, allPokemon]);

  const paginated = filteredPokemon.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = paginated.length < filteredPokemon.length;

  const loadMore = () => setPage((prev) => prev + 1);

  if (loading && filteredPokemon.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des Pokémon...</span>
      </div>
    );
  }

  if (error && filteredPokemon.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={refetchAll}>Réessayer</Button>
      </div>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Pokémon {selectedType && `de type ${selectedType}`}{" "}
          {selectedGeneration && ` (Génération ${selectedGeneration})`}
        </h2>
        <span className="text-muted-foreground">
          {paginated.length} résultat{paginated.length > 1 ? "s" : ""}
        </span>
      </div>

      {paginated.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun Pokémon trouvé avec ces filtres.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginated.map((p) => (
              <PokemonCard key={p.id} pokemon={p} />
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-8">
              <Button onClick={loadMore} variant="outline" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  "Charger plus de Pokémon"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}