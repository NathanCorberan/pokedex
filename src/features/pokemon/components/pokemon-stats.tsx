"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Award, Zap } from "lucide-react"

export function PokemonStats() {
  const topStats = [
    { name: "Mewtwo", stat: "Attaque", value: 110, type: "Psy" },
    { name: "Shuckle", stat: "Défense", value: 230, type: "Insecte" },
    { name: "Ninjask", stat: "Vitesse", value: 160, type: "Insecte" },
    { name: "Chansey", stat: "PV", value: 255, type: "Normal" },
  ]

  const typeDistribution = [
    { type: "Eau", count: 144, percentage: 14.3, color: "bg-blue-500" },
    { type: "Normal", count: 109, percentage: 10.8, color: "bg-gray-500" },
    { type: "Plante", count: 112, percentage: 11.1, color: "bg-green-500" },
    { type: "Psy", count: 103, percentage: 10.2, color: "bg-pink-500" },
    { type: "Feu", count: 76, percentage: 7.5, color: "bg-red-500" },
  ]

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Statistiques globales</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pokemon by Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Records par statistique
            </CardTitle>
            <CardDescription>Les Pokémon avec les meilleures statistiques</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topStats.map((pokemon, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{pokemon.name}</p>
                    <p className="text-sm text-muted-foreground">{pokemon.stat}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{pokemon.value}</p>
                  <Badge variant="outline" className="text-xs">
                    {pokemon.type}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Répartition par type
            </CardTitle>
            <CardDescription>Distribution des Pokémon par type principal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {typeDistribution.map((type, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${type.color}`} />
                    <span className="font-medium">{type.type}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold">{type.count}</span>
                    <span className="text-sm text-muted-foreground ml-1">({type.percentage}%)</span>
                  </div>
                </div>
                <Progress value={type.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Fun Facts */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Le saviez-vous ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
              <p className="text-2xl font-bold text-red-600 mb-1">25</p>
              <p className="text-sm text-muted-foreground">Pikachu est le #25</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <p className="text-2xl font-bold text-blue-600 mb-1">493</p>
              <p className="text-sm text-muted-foreground">Pokémon de type Eau</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <p className="text-2xl font-bold text-purple-600 mb-1">9</p>
              <p className="text-sm text-muted-foreground">Générations disponibles</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
