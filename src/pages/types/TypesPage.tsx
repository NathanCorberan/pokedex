// --- IMPORTS DE DONNÉES ET COMPOSANTS ---
import { useAllTypes } from "@/hooks/pokemon/useAllTypes" // Hook personnalisé pour récupérer tous les types de Pokémon
import { useAllPokemon } from "@/hooks/pokemon/use-pokemon" // Hook personnalisé pour récupérer tous les Pokémon
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card" // Composants UI de carte
import { Badge } from "@/components/ui/badge" // Composant Badge pour afficher une petite étiquette
import { Loader2, Palette } from "lucide-react" // Icônes SVG pour UI
import { Link } from "react-router-dom" // Pour le routing React

// --- TABLEAU DE COULEURS POUR CHAQUE TYPE (utilisé pour les fonds dégradés) ---
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

// --- PETITE DESCRIPTION DE CHAQUE TYPE, POUR LA CARTE ---
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

// --- COMPOSANT PRINCIPAL ---
export function TypesPage() {
  // --- CHARGEMENT DES TYPES ET DES POKÉMONS ---
  // Récupère tous les types de Pokémon via hook
  const { types, loading: typesLoading } = useAllTypes()
  // Récupère un certain nombre de Pokémon (ici 500, peut être augmenté au besoin)
  const { pokemon } = useAllPokemon(500)

  // --- SI EN COURS DE CHARGEMENT, ON AFFICHE UN LOADER ---
  if (typesLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des types...</span>
      </div>
    )
  }

  // --- ASSOCIE À CHAQUE TYPE LE NOMBRE DE POKÉMON DE CE TYPE ---
  const typesWithCount = types.map((type) => {
    // On compte combien de Pokémon ont ce type dans leur tableau "apiTypes"
    const count = pokemon.filter((p) => p.apiTypes.some((t) => t.name === type.name)).length
    // On retourne le type enrichi avec ce nombre
    return { ...type, count }
  })

  // --- RENDU PRINCIPAL ---
  return (
    <main className="container mx-auto px-4 py-8">
      {/* ----- HERO / EN-TÊTE DE PAGE ----- */}
      <section className="text-center mb-12">
        {/* Petit badge d'accroche avec icône palette */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 px-4 py-2 rounded-full mb-6">
          <Palette className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium">Explorez tous les types</span>
        </div>

        {/* Titre principal avec dégradé */}
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
          Types Pokémon
        </h1>

        {/* Petite description de la page */}
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Découvrez les {types.length} types de Pokémon et leurs caractéristiques uniques.
        </p>
      </section>

      {/* ----- CARDS POUR CHAQUE TYPE ----- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Pour chaque type, on crée une carte cliquable */}
        {typesWithCount.map((type) => (
          <Link key={type.id} to={`/types/${encodeURIComponent(type.name)}`} className="block">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
              <CardHeader className="pb-4">
                {/* Logo du type dans un cercle dégradé */}
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
                {/* Nom du type */}
                <CardTitle className="text-center text-xl">{type.name}</CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Petite description textuelle du type */}
                <p className="text-sm text-muted-foreground text-center mb-4 min-h-[40px]">
                  {typeDescriptions[type.name] || "Type de Pokémon unique"}
                </p>
                {/* Badge avec le nombre de Pokémon de ce type */}
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

      {/* ----- SECTION STATS GLOBALES SUR LES TYPES ----- */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Statistiques des types</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Nombre total de types */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-purple-500">{types.length}</CardTitle>
              <p className="text-muted-foreground">Types disponibles</p>
            </CardHeader>
          </Card>

          {/* Nombre maximum de Pokémon dans un type */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-blue-500">
                {typesWithCount.length > 0 ? Math.max(...typesWithCount.map((t) => t.count)) : 0}
              </CardTitle>
              <p className="text-muted-foreground">Pokémon max par type</p>
            </CardHeader>
          </Card>

          {/* Moyenne de Pokémon par type */}
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
