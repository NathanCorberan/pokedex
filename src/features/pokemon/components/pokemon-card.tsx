import { useState } from "react"
// Composants d’UI : carte, badge, bouton, barre de progression, etc.
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
// Icônes Lucide
import { Heart, Info } from "lucide-react"
// Composant de dialogue (popup détails)
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// Typage TypeScript des données d’un Pokémon (format API)
import type { PokemonApiData } from "@/types/pokemon"
// Hook custom pour gérer les favoris (ajout/suppression, etc.)
import { useFavorites } from "@/hooks/use-favorites"

// Props attendues : un objet PokemonApiData (un Pokémon)
interface PokemonCardProps {
  pokemon: PokemonApiData;
}

// Dictionnaire pour coloriser les badges de types (classe Tailwind par nom)
const typeColors: Record<string, string> = {
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
  Combat: "bg-orange-600",
  Roche: "bg-yellow-700",
  Sol: "bg-yellow-600",
  Insecte: "bg-green-600",
  Spectre: "bg-purple-700",
  Acier: "bg-gray-400",
  Fée: "bg-pink-300",
  Ténèbres: "bg-gray-800",
}

// Composant principal
export function PokemonCard({ pokemon }: PokemonCardProps) {
  // Hook pour l’état favori
  const { isFavorite, toggleFavorite } = useFavorites()
  // Etat local : image cassée ? (affiche un placeholder si oui)
  const [imageError, setImageError] = useState(false)

  // Handler pour basculer favori/non-favori
  const handleToggleFavorite = () => {
    toggleFavorite(pokemon.pokedexId)
  }

  // Calcul du total des stats
  const totalStats = Object.values(pokemon.stats).reduce((sum, stat) => sum + stat, 0)

  // --- RENDU PRINCIPAL ---
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* En-tête : numéro + bouton favori + image */}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          {/* Numéro du Pokédex (toujours sur 3 chiffres) */}
          <span className="text-sm text-muted-foreground">
            #{pokemon.pokedexId.toString().padStart(3, "0")}
          </span>
          {/* Bouton favori (toggle) */}
          <Button variant="ghost" size="icon" onClick={handleToggleFavorite} className="h-8 w-8">
            <Heart
              className={`h-4 w-4 ${
                isFavorite(pokemon.pokedexId) ? "fill-red-500 text-red-500" : "text-muted-foreground"
              }`}
            />
          </Button>
        </div>

        {/* Image Pokémon, gestion de l’erreur (fallback) */}
        <div className="relative mx-auto">
          <img
            src={imageError ? "/placeholder.svg" : pokemon.image}
            alt={pokemon.name}
            width={120}
            height={120}
            className="mx-auto group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Nom du Pokémon */}
        <h3 className="font-bold text-lg mb-2 text-center">{pokemon.name}</h3>

        {/* Badges de types */}
        <div className="flex flex-wrap gap-1 justify-center mb-4">
          {pokemon.apiTypes.map((type) => (
            <Badge
              key={type.name}
              className={`${typeColors[type.name] || "bg-gray-500"} text-white text-xs`}
            >
              {type.name}
            </Badge>
          ))}
        </div>

        {/* Statistiques rapides : PV et Attaque (avec barres de progression) */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>PV</span>
            <span>{pokemon.stats.HP}</span>
          </div>
          <Progress value={(pokemon.stats.HP / 200) * 100} className="h-2" />

          <div className="flex justify-between text-sm">
            <span>Attaque</span>
            <span>{pokemon.stats.attack}</span>
          </div>
          <Progress value={(pokemon.stats.attack / 200) * 100} className="h-2" />
        </div>

        {/* Bouton pour ouvrir la modale “détails” */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full bg-transparent">
              <Info className="mr-2 h-4 w-4" />
              Détails
            </Button>
          </DialogTrigger>

          {/* Contenu de la modale de détails */}
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <img
                  src={imageError ? "/placeholder.svg" : pokemon.image}
                  alt={pokemon.name}
                  width={40}
                  height={40}
                  onError={() => setImageError(true)}
                />
                {pokemon.name}
                <span className="text-sm text-muted-foreground">
                  #{pokemon.pokedexId.toString().padStart(3, "0")}
                </span>
              </DialogTitle>
              <DialogDescription>
                Pokémon de génération {pokemon.apiGeneration}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Types (rappel dans la modale) */}
              <div>
                <h4 className="font-semibold mb-2">Types</h4>
                <div className="flex gap-2">
                  {pokemon.apiTypes.map((type) => (
                    <Badge
                      key={type.name}
                      className={`${typeColors[type.name] || "bg-gray-500"} text-white`}
                    >
                      {type.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Toutes les statistiques avec barres de progression */}
              <div>
                <h4 className="font-semibold mb-3">Statistiques</h4>
                <div className="space-y-3">
                  {/* Boucle sur la liste ordonnée des stats */}
                  {[
                    ["PV", pokemon.stats.HP],
                    ["Attaque", pokemon.stats.attack],
                    ["Défense", pokemon.stats.defense],
                    ["Att. Spé.", pokemon.stats.special_attack],
                    ["Déf. Spé.", pokemon.stats.special_defense],
                    ["Vitesse", pokemon.stats.speed],
                  ].map(([label, value]) => (
                    <div key={label as string}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{label}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                      <Progress value={((value as number) / 200) * 100} className="h-2" />
                    </div>
                  ))}

                  {/* Total général des stats */}
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Total</span>
                      <span>{totalStats}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Évolutions, si le Pokémon en a */}
              {pokemon.apiEvolutions && pokemon.apiEvolutions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Évolutions</h4>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.apiEvolutions.map((evo) => (
                      <Badge key={evo.pokedexId} variant="outline">
                        {evo.name} (#{evo.pokedexId})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Résistances, si dispo (affichage limité à 6 pour la lisibilité) */}
              {pokemon.apiResistances && pokemon.apiResistances.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Résistances</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {pokemon.apiResistances.slice(0, 6).map((resistance, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{resistance.name}</span>
                        <span
                          className={`font-medium ${
                            resistance.damage_multiplier < 1
                              ? "text-green-600"
                              : resistance.damage_multiplier > 1
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          ×{resistance.damage_multiplier}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
