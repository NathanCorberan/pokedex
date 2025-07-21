import { useAllTypes } from "@/hooks/pokemon/useAllTypes"
import { useAllPokemon } from "@/hooks/pokemon/use-pokemon"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Palette } from "lucide-react"
import { Link } from "react-router-dom"

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

const typeDescriptions: Record<string, string> = {
  Feu: "Pokémon ardents et passionnés, maîtres des flammes",
  Eau: "Pokémon aquatiques, fluides et adaptables",
  Plante: "Pokémon liés à la nature et à la photosynthèse",
  Électrik: "Pokémon électriques, rapides et énergiques",
  Psy: "Pokémon aux pouvoirs mentaux extraordinaires",
  Glace: "Pokémon des régions froides, cristallins et purs",
  Dragon: "Pokémon légendaires, puissants et mystiques",
  Vol: "Pokémon aériens, libres et gracieux",
  Poison: "Pokémon toxiques aux capacités dangereuses",
  Normal: "Pokémon polyvalents et équilibrés",
  Combat: "Pokémon guerriers aux techniques martiales",
  Roche: "Pokémon solides et résistants",
  Sol: "Pokémon terrestres, stables et robustes",
  Insecte: "Pokémon arthropodes, agiles et nombreux",
  Spectre: "Pokémon fantomatiques et mystérieux",
  Acier: "Pokémon métalliques, durs et durables",
  Fée: "Pokémon magiques et enchanteurs",
  Ténèbres: "Pokémon sombres aux techniques sournoises",
}

export function TypesPage() {
  const { types, loading: typesLoading } = useAllTypes()
  const { pokemon } = useAllPokemon(500)

  if (typesLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des types...</span>
      </div>
    )
  }

  const typesWithCount = types.map((type) => {
    const count = pokemon.filter((p) => p.apiTypes.some((t) => t.name === type.name)).length
    return { ...type, count }
  })

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 px-4 py-2 rounded-full mb-6">
          <Palette className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium">Explorez tous les types</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
          Types Pokémon
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Découvrez les {types.length} types de Pokémon et leurs caractéristiques uniques.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {typesWithCount.map((type) => (
          <Link key={type.id} to={`/types/${encodeURIComponent(type.name)}`} className="block">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
              <CardHeader className="pb-4">
                <div
                  className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${
                    typeColors[type.name] || "from-gray-400 to-gray-600"
                  } flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <img
                    src={type.image || "/placeholder.svg"}
                    alt={type.name}
                    width={32}
                    height={32}
                    className="filter brightness-0 invert"
                  />
                </div>
                <CardTitle className="text-center text-xl">{type.name}</CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground text-center mb-4 min-h-[40px]">
                  {typeDescriptions[type.name] || "Type de Pokémon unique"}
                </p>
                <div className="flex justify-center">
                  <Badge
                    variant="secondary"
                    className={`bg-gradient-to-r ${
                      typeColors[type.name] || "from-gray-400 to-gray-600"
                    } text-white border-0`}
                  >
                    {type.count > 0 ? `${type.count} Pokémon` : "Pokémon"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Statistiques des types</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-purple-500">{types.length}</CardTitle>
              <p className="text-muted-foreground">Types disponibles</p>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-blue-500">
                {typesWithCount.length > 0 ? Math.max(...typesWithCount.map((t) => t.count)) : 0}
              </CardTitle>
              <p className="text-muted-foreground">Pokémon max par type</p>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-green-500">
                {typesWithCount.length > 0
                  ? Math.round(typesWithCount.reduce((sum, t) => sum + t.count, 0) / typesWithCount.length)
                  : 0}
              </CardTitle>
              <p className="text-muted-foreground">Moyenne par type</p>
            </CardHeader>
          </Card>
        </div>
      </section>
    </main>
  )
}
