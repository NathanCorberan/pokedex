import { useState } from "react";
import { PokemonGrid } from "@/features/pokemon/components/pokemon-grid";
import { PokemonFilters } from "@/features/pokemon/components/pokemon-filters";
import { PokemonStats } from "@/features/pokemon/components/pokemon-stats";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Star, Zap } from "lucide-react";
import { useAllPokemon } from "@/hooks/pokemon/useAllPokemon";
import { useAllTypes } from "@/hooks/pokemon/useAllTypes";

export function Home() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedGeneration, setSelectedGeneration] = useState<string>("");

  const { pokemon } = useAllPokemon(100);
  const { types } = useAllTypes();

  const totalPokemon = pokemon.length;
  const totalTypes = types.length;
  const totalGenerations =
    pokemon.length > 0 ? Math.max(...pokemon.map((p) => p.apiGeneration)) : 9;

  const typeDistribution = types
    .slice(0, 5)
    .map((type) => {
      const count = pokemon.filter((p) =>
        p.apiTypes.some((t) => t.name === type.name)
      ).length;
      return {
        name: type.name,
        count,
        color: getTypeColor(type.name),
      };
    })
    .sort((a, b) => b.count - a.count);

  function getTypeColor(typeName: string): string {
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
    return colors[typeName] || "bg-gray-500";
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-100 to-blue-100 dark:from-red-900/20 dark:to-blue-900/20 px-4 py-2 rounded-full mb-6">
          <Sparkles className="h-4 w-4 text-red-500" />
          <span className="text-sm font-medium">Découvrez le monde des Pokémon</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent">
          Pokédex Interactif
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explorez plus de 1000 Pokémon avec leurs statistiques, types, évolutions et bien plus encore.
        </p>

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

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-red-500">
              {totalPokemon > 0 ? `${totalPokemon}+` : "1010+"}
            </CardTitle>
            <CardDescription>Pokémon disponibles</CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-blue-500">{totalTypes || 18}</CardTitle>
            <CardDescription>Types différents</CardDescription>
          </CardHeader>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-yellow-500">{totalGenerations}</CardTitle>
            <CardDescription>Générations</CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Popular Types */}
      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Types populaires</h2>
        </div>

        <div className="flex flex-wrap gap-3">
          {typeDistribution.map((type) => (
            <Badge
              key={type.name}
              variant="secondary"
              className={`${type.color} text-white hover:opacity-80 cursor-pointer px-4 py-2 text-sm`}
              onClick={() => setSelectedType(selectedType === type.name ? "" : type.name)}
            >
              {type.name} ({type.count})
            </Badge>
          ))}
        </div>
      </section>

      {/* Filters */}
      <PokemonFilters
        selectedType={selectedType}
        selectedGeneration={selectedGeneration}
        onTypeChange={setSelectedType}
        onGenerationChange={setSelectedGeneration}
      />

      {/* Pokemon Grid */}
      <PokemonGrid selectedType={selectedType} selectedGeneration={selectedGeneration} />

      {/* Stats Section */}
      <PokemonStats />
    </main>
  );
}
