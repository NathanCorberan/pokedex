import { useState, useEffect } from "react"
// Composant pour afficher la carte d’un Pokémon individuel
import { PokemonCard } from "./pokemon-card"
// Composant bouton UI
import { Button } from "@/components/ui/button"
// Icône de chargement
import { Loader2 } from "lucide-react"
// Typage des données d’un Pokémon (API)
import type { PokemonApiData } from "@/types/pokemon"

// Hooks personnalisés pour récupérer la liste de tous les Pokémon et ceux d’une génération précise
import { useAllPokemon } from "@/hooks/pokemon/useAllPokemon"
import { usePokemonByGeneration } from "@/hooks/pokemon/usePokemonByGeneration"

// Props attendues : les filtres sélectionnés (type et génération)
interface PokemonGridProps {
  selectedType: string;
  selectedGeneration: string;
}

// Composant principal d’affichage du tableau des Pokémon filtrés + pagination
export function PokemonGrid({ selectedType, selectedGeneration }: PokemonGridProps) {
  // Etat local : la liste des Pokémon filtrés selon les filtres actifs
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonApiData[]>([])
  // Etat local : numéro de la page pour la pagination (1 = première page)
  const [page, setPage] = useState(1)
  // Nombre d’items à afficher par page (pagination)
  const ITEMS_PER_PAGE = 20

  // Conversion de la génération sélectionnée (string → nombre)
  const genNumber = Number(selectedGeneration)
  // On charge jusqu’à 400 Pokémon au maximum pour l’instant
  const { pokemon: allPokemon, loading: loadingAll, error: errorAll, refetch: refetchAll } = useAllPokemon(400)
  // (Bonus, tu pourrais utiliser byGen directement si tu veux charger génération par génération)
  const { pokemon: byGen, loading: loadingGen, error: errorGen } = usePokemonByGeneration(isNaN(genNumber) ? undefined : genNumber)

  // On combine les états de chargement et d’erreur des deux hooks pour gérer tous les cas
  const loading = loadingAll || loadingGen
  const error = errorAll || errorGen

  // À chaque changement de filtre OU de la liste des Pokémon, on filtre et on reset la pagination
  useEffect(() => {
    // On part de la liste complète
    let result = allPokemon

    // Filtre par type (si renseigné)
    if (selectedType) {
      result = result.filter((p) =>
        p.apiTypes.some((t) => t.name.toLowerCase() === selectedType.toLowerCase())
      )
    }

    // Filtre par génération (si renseignée et conversion valide)
    if (selectedGeneration && !isNaN(genNumber)) {
      result = result.filter((p) => p.apiGeneration === genNumber)
    }

    // On met à jour la liste filtrée et on revient à la première page
    setFilteredPokemon(result)
    setPage(1)
  }, [selectedType, selectedGeneration, allPokemon])

  // On détermine les Pokémon à afficher en fonction de la page courante (pagination "load more")
  const paginated = filteredPokemon.slice(0, page * ITEMS_PER_PAGE)
  const hasMore = paginated.length < filteredPokemon.length

  // Fonction pour passer à la page suivante (charger plus)
  const loadMore = () => setPage((prev) => prev + 1)

  // Affichage d’un spinner si on charge et qu’aucun Pokémon n’a encore été filtré
  if (loading && filteredPokemon.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des Pokémon...</span>
      </div>
    )
  }

  // Affichage d’un message d’erreur si on a une erreur et aucun Pokémon affiché
  if (error && filteredPokemon.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={refetchAll}>Réessayer</Button>
      </div>
    )
  }

  // Rendu principal : header + grid + bouton "Charger plus" si nécessaire
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

      {/* Affiche un message si aucun Pokémon ne correspond aux filtres */}
      {paginated.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun Pokémon trouvé avec ces filtres.</p>
        </div>
      ) : (
        <>
          {/* Grille responsive d’affichage des cartes de Pokémon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginated.map((p) => (
              <PokemonCard key={p.id} pokemon={p} />
            ))}
          </div>

          {/* Bouton pour charger plus de Pokémon s’il en reste à afficher */}
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
  )
}
