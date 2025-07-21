import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Filter } from "lucide-react"
import { PokemonCard } from "@/features/pokemon/components/pokemon-card"
import { usePokemonByType } from "@/hooks/pokemon/usePokemonByType"

const typeColors: Record<string, string> = {
  Feu: "from-red-400 to-red-600",
  Eau: "from-blue-400 to-blue-600",
  Plante: "from-green-400 to-green-600",
  Électrik: "from-yellow-400 to-yellow-600",
  Psy: "from-pink-400 to-pink-600",
  Glace: "from-cyan-400 to-cyan-600",
  Dragon: "from-purple-400 to-purple-600",
  Vol: "from-indigo-400 to-indigo-600",
  Poison: "from-purple-500 to-purple-700",
  Normal: "from-gray-400 to-gray-600",
  Combat: "from-orange-500 to-orange-700",
  Roche: "from-yellow-600 to-yellow-800",
  Sol: "from-yellow-500 to-yellow-700",
  Insecte: "from-green-500 to-green-700",
  Spectre: "from-purple-600 to-purple-800",
  Acier: "from-gray-300 to-gray-500",
  Fée: "from-pink-300 to-pink-500",
  Ténèbres: "from-gray-700 to-gray-900",
}

export function TypeDetailPage() {
  const { typeName } = useParams<{ typeName: string }>()
  const { pokemon, loading, error } = usePokemonByType(typeName ?? "")
  const [sortBy, setSortBy] = useState<"id" | "name" | "stats">("id")

  const sortedPokemon = [...pokemon].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "stats":
        const totalA = Object.values(a.stats).reduce((sum, stat) => sum + stat, 0)
        const totalB = Object.values(b.stats).reduce((sum, stat) => sum + stat, 0)
        return totalB - totalA
      default:
        return a.pokedexId - b.pokedexId
    }
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des Pokémon de type {typeName}...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Réessayer</Button>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <section className="mb-8">
        <Link to="/types">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux types
          </Button>
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${
              typeColors[typeName || ""] || "from-gray-400 to-gray-600"
            } flex items-center justify-center`}
          >
            <span className="text-2xl font-bold text-white">{typeName?.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Pokémon de type {typeName}</h1>
            <p className="text-muted-foreground">
              {pokemon.length} Pokémon{pokemon.length > 1 ? "s" : ""} de ce type
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pokemon.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Générations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {pokemon.length > 0 ? new Set(pokemon.map((p) => p.apiGeneration)).size : 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stats moy.</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {pokemon.length > 0
                ? Math.round(
                    pokemon.reduce((sum, p) => sum + Object.values(p.stats).reduce((s, stat) => s + stat, 0), 0) /
                      pokemon.length
                  )
                : 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Plus fort</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {pokemon.length > 0
                ? Math.max(...pokemon.map((p) => Object.values(p.stats).reduce((sum, stat) => sum + stat, 0)))
                : 0}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Filtres */}
      <section className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Trier par
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant={sortBy === "id" ? "default" : "outline"} size="sm" onClick={() => setSortBy("id")}>
                Numéro
              </Button>
              <Button variant={sortBy === "name" ? "default" : "outline"} size="sm" onClick={() => setSortBy("name")}>
                Nom
              </Button>
              <Button variant={sortBy === "stats" ? "default" : "outline"} size="sm" onClick={() => setSortBy("stats")}>
                Statistiques
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Pokémon Grid */}
      <section>
        {sortedPokemon.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun Pokémon trouvé pour ce type.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedPokemon.map((p) => (
              <PokemonCard key={p.id} pokemon={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
