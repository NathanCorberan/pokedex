// --- IMPORTS ---
// React : hooks pour gérer l’état et les effets de bord
import { useState, useEffect } from "react";

// Composants UI réutilisables (cartes, boutons, badges...)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Icônes SVG pour l’interface (chargement, cœur, poubelle, filtre...)
import { Loader2, Heart, Trash2, Filter } from "lucide-react";

// Composant pour afficher une carte de Pokémon (mini-fiche)
import { PokemonCard } from "@/features/pokemon/components/pokemon-card";

// Hook personnalisé pour gérer les favoris Pokémon (ajout, retrait, clear...)
import { useFavorites } from "@/hooks/use-favorites";

// Type TypeScript représentant les données d’un Pokémon de l’API
import type { PokemonApiData } from "@/types/pokemon";

// Fonction asynchrone pour aller chercher un Pokémon par son ID
import { fetchPokemonById } from "@/features/pokemon/api/fetchPokemonById";

// Composants d’alerte/dialogue pour confirmer la suppression de tous les favoris
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

// Pour naviguer vers la page d’accueil avec un bouton
import { Link } from "react-router-dom";

// --- DÉCLARATION DU COMPOSANT PRINCIPAL ---
export function FavorisPage() {
  // --- HOOKS FAVORIS ---
  // Récupère la liste des IDs favoris, la fonction pour tout supprimer, et le compte total
  const { favorites, clearFavorites, count } = useFavorites();

  // --- ÉTATS LOCAUX ---
  // Liste détaillée des Pokémon favoris (informations complètes, pas seulement leur id)
  const [favoritePokemon, setFavoritePokemon] = useState<PokemonApiData[]>([]);
  // État de chargement (true si on attend la récupération des données)
  const [loading, setLoading] = useState(true);
  // Message d’erreur à afficher en cas de souci lors du chargement
  const [error, setError] = useState<string | null>(null);
  // Critère de tri sélectionné par l’utilisateur
  const [sortBy, setSortBy] = useState<"id" | "name" | "type" | "stats">("id");

  // --- EFFET POUR CHARGER LES INFOS DES FAVORIS ---
  useEffect(() => {
    // Fonction asynchrone pour charger tous les Pokémon favoris depuis l’API
    const fetchFavoritePokemon = async () => {
      if (favorites.length === 0) {
        // Aucun favori : on vide la liste et on arrête le chargement
        setFavoritePokemon([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null); // On réinitialise l’erreur

        // Pour chaque ID favori, on va chercher le détail du Pokémon
        const promises = favorites.map((id) => fetchPokemonById(id));
        // Promise.all attend que toutes les requêtes soient terminées
        const results = await Promise.all(promises);
        // On filtre pour ne garder que les Pokémon valides (non null)
        const validPokemon = results.filter((p): p is PokemonApiData => p !== null);
        setFavoritePokemon(validPokemon);
      } catch (err) {
        setError("Erreur lors du chargement des favoris");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // On lance la récupération à chaque fois que la liste d’IDs change
    fetchFavoritePokemon();
  }, [favorites]);

  // --- TRI DES POKÉMONS FAVORIS SELON LE CRITÈRE CHOISI ---
  const sortedPokemon = [...favoritePokemon].sort((a, b) => {
    switch (sortBy) {
      case "name":
        // Tri alphabétique sur le nom
        return a.name.localeCompare(b.name);
      case "type":
        // Tri alphabétique sur le premier type
        return a.apiTypes[0]?.name.localeCompare(b.apiTypes[0]?.name || "");
      case "stats":
        // Tri par total de stats (plus fort en premier)
        const totalA = Object.values(a.stats).reduce((s, n) => s + n, 0);
        const totalB = Object.values(b.stats).reduce((s, n) => s + n, 0);
        return totalB - totalA;
      default:
        // Par défaut : tri par numéro Pokédex (ordre croissant)
        return a.pokedexId - b.pokedexId;
    }
  });

  // --- AFFICHAGE EN COURS DE CHARGEMENT ---
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement de vos favoris...</span>
      </div>
    );
  }

  // --- RENDU PRINCIPAL ---
  return (
    <main className="container mx-auto px-4 py-8">
      {/* --- EN-TÊTE (section Hero) --- */}
      <section className="text-center mb-12">
        {/* Badge haut de page avec icône cœur */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-red-100 dark:from-pink-900/20 dark:to-red-900/20 px-4 py-2 rounded-full mb-6">
          <Heart className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium">Vos Pokémon préférés</span>
        </div>

        {/* Titre principal, joli dégradé */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
          Mes Favoris
        </h1>

        {/* Sous-titre qui précise combien de favoris sont présents */}
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {count > 0
            ? `Vous avez ${count} Pokémon${count > 1 ? "s" : ""} dans vos favoris`
            : "Vous n'avez pas encore de Pokémon favoris"}
        </p>
      </section>

      {/* --- AFFICHAGE D’UNE ERREUR S’IL Y EN A UNE --- */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      )}

      {/* --- CAS AUCUN FAVORI : MESSAGE D’ACCUEIL --- */}
      {count === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Heart className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Aucun favori pour le moment</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Explorez les Pokémon et cliquez sur le cœur pour les ajouter à vos favoris !
          </p>
          {/* Bouton qui ramène à l’accueil pour explorer les Pokémon */}
          <Button asChild>
            <Link to="/">Découvrir les Pokémon</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* --- STATS RAPIDES SUR LES FAVORIS --- */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Nombre total de favoris */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-500">{count}</p>
              </CardContent>
            </Card>

            {/* Nombre de types uniques présents dans les favoris */}
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

            {/* Nombre de générations représentées dans les favoris */}
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

            {/* Moyenne des statistiques totales (additionne toutes les stats de chaque pokémon puis moyenne) */}
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

          {/* --- FILTRES ET TRI DES FAVORIS --- */}
          <section className="mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  {/* Choix du critère de tri */}
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Trier par
                  </CardTitle>
                  {/* Bouton pour supprimer tous les favoris, confirmation avec AlertDialog */}
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
                {/* Liste des boutons pour changer le tri */}
                <div className="flex gap-2">
                  {["id", "name", "type", "stats"].map((key) => (
                    <Button
                      key={key}
                      variant={sortBy === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortBy(key as any)}
                    >
                      {key === "id"
                        ? "Numéro"
                        : key === "name"
                        ? "Nom"
                        : key === "type"
                        ? "Type"
                        : "Statistiques"}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* --- STATISTIQUES PAR TYPE (badges) --- */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Types dans vos favoris</h2>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(favoritePokemon.flatMap((p) => p.apiTypes.map((t) => t.name))))
                .slice(0, 10)
                .map((typeName) => {
                  // Nombre de Pokémon de ce type parmi les favoris
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

          {/* --- AFFICHAGE DES CARTES DE TOUS LES POKÉMON FAVORIS --- */}
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
