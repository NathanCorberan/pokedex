import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Heart, Trash2, Filter } from "lucide-react";
import { PokemonCard } from "@/features/pokemon/components/pokemon-card";
import { useFavorites } from "@/hooks/use-favorites";
import type { PokemonApiData } from "@/types/pokemon";
import { fetchPokemonById } from "@/features/pokemon/api/fetchPokemonById";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";

export function FavorisPage() {
  const { favorites, clearFavorites, count } = useFavorites();
  const [favoritePokemon, setFavoritePokemon] = useState<PokemonApiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"id" | "name" | "type" | "stats">("id");

  useEffect(() => {
    const fetchFavoritePokemon = async () => {
      if (favorites.length === 0) {
        setFavoritePokemon([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const promises = favorites.map((id) => fetchPokemonById(id));
        const results = await Promise.all(promises);
        const validPokemon = results.filter((p): p is PokemonApiData => p !== null);
        setFavoritePokemon(validPokemon);
      } catch (err) {
        setError("Erreur lors du chargement des favoris");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritePokemon();
  }, [favorites]);

  const sortedPokemon = [...favoritePokemon].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "type":
        return a.apiTypes[0]?.name.localeCompare(b.apiTypes[0]?.name || "");
      case "stats":
        const totalA = Object.values(a.stats).reduce((s, n) => s + n, 0);
        const totalB = Object.values(b.stats).reduce((s, n) => s + n, 0);
        return totalB - totalA;
      default:
        return a.pokedexId - b.pokedexId;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement de vos favoris...</span>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-red-100 dark:from-pink-900/20 dark:to-red-900/20 px-4 py-2 rounded-full mb-6">
          <Heart className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium">Vos Pokémon préférés</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
          Mes Favoris
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {count > 0
            ? `Vous avez ${count} Pokémon${count > 1 ? "s" : ""} dans vos favoris`
            : "Vous n'avez pas encore de Pokémon favoris"}
        </p>
      </section>

      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      )}

      {count === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Aucun favori pour le moment</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Explorez les Pokémon et cliquez sur le cœur pour les ajouter à vos favoris !
          </p>
          <Button asChild>
            <Link to="/">Découvrir les Pokémon</Link>
          </Button>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-500">{count}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Types uniques</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-500">
                  {new Set(favoritePokemon.flatMap((p) => p.apiTypes.map((t) => t.name))).size}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Générations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-500">
                  {new Set(favoritePokemon.map((p) => p.apiGeneration)).size}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Stats moy.</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-purple-500">
                  {favoritePokemon.length > 0
                    ? Math.round(
                        favoritePokemon.reduce(
                          (sum, p) => sum + Object.values(p.stats).reduce((s, stat) => s + stat, 0),
                          0,
                        ) / favoritePokemon.length,
                      )
                    : 0}
                </p>
              </CardContent>
            </Card>
          </section>

          <section className="mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Trier par
                  </CardTitle>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Tout supprimer
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer tous les favoris ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action supprimera tous vos Pokémon favoris. Elle est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={clearFavorites}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Supprimer tout
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {["id", "name", "type", "stats"].map((key) => (
                    <Button
                      key={key}
                      variant={sortBy === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortBy(key as any)}
                    >
                      {key === "id" ? "Numéro" : key === "name" ? "Nom" : key === "type" ? "Type" : "Statistiques"}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Types dans vos favoris</h2>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(favoritePokemon.flatMap((p) => p.apiTypes.map((t) => t.name))))
                .slice(0, 10)
                .map((typeName) => {
                  const count = favoritePokemon.filter((p) =>
                    p.apiTypes.some((t) => t.name === typeName),
                  ).length;
                  return (
                    <Badge key={typeName} variant="secondary" className="px-3 py-1">
                      {typeName} ({count})
                    </Badge>
                  );
                })}
            </div>
          </section>

          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedPokemon.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
