// Importation de useState pour la gestion des états locaux dans le composant
import { useState } from "react";
// Importation des composants principaux de la "feature Pokémon"
import { PokemonGrid } from "@/features/pokemon/components/pokemon-grid";
import { PokemonFilters } from "@/features/pokemon/components/pokemon-filters";
import { PokemonStats } from "@/features/pokemon/components/pokemon-stats";
// Composants UI réutilisables pour les boutons, cartes, badges...
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Icônes SVG pour illustrer les sections, issues de la librairie lucide-react
import { Sparkles, TrendingUp, Star, Zap } from "lucide-react";
// Hooks personnalisés pour récupérer tous les Pokémon et tous les types
import { useAllPokemon } from "@/hooks/pokemon/useAllPokemon";
import { useAllTypes } from "@/hooks/pokemon/useAllTypes";

// Déclaration du composant principal de la page d'accueil
export function Home() {
  // --- 1. ÉTATS LOCAUX ---
  // Type de Pokémon sélectionné par l'utilisateur (pour filtrer l'affichage)
  const [selectedType, setSelectedType] = useState<string>("");
  // Génération sélectionnée (idem)
  const [selectedGeneration, setSelectedGeneration] = useState<string>("");

  // --- 2. DONNÉES ISSUES DES HOOKS PERSONNALISÉS ---
  // Récupère les 100 premiers Pokémon (tu peux augmenter la limite)
  const { pokemon } = useAllPokemon(100);
  // Récupère tous les types de Pokémon (Feu, Eau, Plante, etc)
  const { types } = useAllTypes();

  // --- 3. STATISTIQUES GLOBALES ---
  // Nombre total de Pokémon chargés (par défaut 100 ici)
  const totalPokemon = pokemon.length;
  // Nombre de types différents récupérés (ex : 18 au total)
  const totalTypes = types.length;
  // Calcul du nombre de générations (en cherchant la valeur max dans les Pokémon)
  const totalGenerations =
    pokemon.length > 0 ? Math.max(...pokemon.map((p) => p.apiGeneration)) : 9; // 9 par défaut

  // --- 4. RÉPARTITION DES TYPES (pour la section "Types populaires") ---
  // Prend les 5 premiers types (à modifier selon le besoin)
  const typeDistribution = types
    .slice(0, 5)
    .map((type) => {
      // Nombre de Pokémon de ce type
      const count = pokemon.filter((p) =>
        p.apiTypes.some((t) => t.name === type.name)
      ).length;
      // Retourne un objet pour chaque type avec son nom, le nombre et sa couleur
      return {
        name: type.name,
        count,
        color: getTypeColor(type.name), // Voir fonction plus bas
      };
    })
    .sort((a, b) => b.count - a.count); // Trie du plus fréquent au moins fréquent

  // --- 5. FONCTION utilitaire POUR ASSIGNER UNE COULEUR À CHAQUE TYPE ---
  function getTypeColor(typeName: string): string {
    // Dictionnaire : type → couleur de badge
    const colors: Record<string, string> = {
      Feu: "bg-red-500",
      Eau: "bg-blue-500",
      Plante: "bg-green-500",
      Électrik: "bg-yellow-500",
      Psy: "bg-pink-500",
      Glace: "bg-cyan-500",
      Dragon: "bg-purple-500",
      Vol: "bg-indigo-500",
      Poison: "bg-purple-600",
      Normal: "bg-gray-500",
    };
    // Retourne la couleur ou une couleur par défaut si inconnue
    return colors[typeName] || "bg-gray-500";
  }

  // --- 6. RENDU DE LA PAGE ---
  return (
    <main className="container mx-auto px-4 py-8">
      {/* --------- HERO --------- */}
      <section className="text-center mb-12">
        {/* Badge d'accroche "Découvrez le monde..." */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-blue-100 dark:from-red-900/20 dark:to-blue-900/20 px-4 py-2 rounded-full mb-6">
          <Sparkles className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium">Découvrez le monde des Pokémon</span>
        </div>

        {/* Gros titre de la page, dégradé multicolore */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent">
          Pokédex Interactif
        </h1>

        {/* Petite phrase d'accroche */}
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explorez plus de 1000 Pokémon avec leurs statistiques, types, évolutions et bien plus encore.
        </p>

        {/* Boutons d'action principaux */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button size="lg" className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
            <Zap className="mr-2 h-4 w-4" />
            Explorer maintenant
          </Button>
          <Button variant="outline" size="lg">
            <Star className="mr-2 h-4 w-4" />
            Mes favoris
          </Button>
        </div>
      </section>

      {/* --------- CARDS DE STATISTIQUES --------- */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Nombre total de Pokémon */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-red-500">
              {totalPokemon > 0 ? `${totalPokemon}+` : "1010+"}
            </CardTitle>
            <CardDescription>Pokémon disponibles</CardDescription>
          </CardHeader>
        </Card>
        {/* Nombre de types */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-blue-500">{totalTypes || 18}</CardTitle>
            <CardDescription>Types différents</CardDescription>
          </CardHeader>
        </Card>
        {/* Nombre de générations */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-yellow-500">{totalGenerations}</CardTitle>
            <CardDescription>Générations</CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* --------- TYPES POPULAIRES --------- */}
      <section className="mb-12">
        {/* Titre + icône */}
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Types populaires</h2>
        </div>
        {/* Badges cliquables des types principaux */}
        <div className="flex flex-wrap gap-3">
          {typeDistribution.map((type) => (
            <Badge
              key={type.name}
              variant="secondary"
              className={`${type.color} text-white hover:opacity-80 cursor-pointer px-4 py-2 text-sm`}
              // Clic sur un badge => filtre par ce type (toggle si déjà sélectionné)
              onClick={() => setSelectedType(selectedType === type.name ? "" : type.name)}
            >
              {type.name} ({type.count})
            </Badge>
          ))}
        </div>
      </section>

      {/* --------- FILTRES AVANCÉS --------- */}
      <PokemonFilters
        selectedType={selectedType}
        selectedGeneration={selectedGeneration}
        onTypeChange={setSelectedType}
        onGenerationChange={setSelectedGeneration}
      />

      {/* --------- AFFICHAGE DES POKÉMONS EN GRILLE --------- */}
      <PokemonGrid selectedType={selectedType} selectedGeneration={selectedGeneration} />

      {/* --------- STATISTIQUES GLOBALES SUR LES POKÉMONS --------- */}
      <PokemonStats />
    </main>
  );
}
