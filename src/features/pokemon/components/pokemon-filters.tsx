"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, X } from "lucide-react"
import { useAllTypes } from "@/hooks/pokemon/useAllTypes"

interface PokemonFiltersProps {
  selectedType: string
  selectedGeneration: string
  onTypeChange: (type: string) => void
  onGenerationChange: (generation: string) => void
}

const generations = [
  { value: "1", label: "Génération I (Kanto)" },
  { value: "2", label: "Génération II (Johto)" },
  { value: "3", label: "Génération III (Hoenn)" },
  { value: "4", label: "Génération IV (Sinnoh)" },
  { value: "5", label: "Génération V (Unys)" },
  { value: "6", label: "Génération VI (Kalos)" },
  { value: "7", label: "Génération VII (Alola)" },
  { value: "8", label: "Génération VIII (Galar)" },
  { value: "9", label: "Génération IX (Paldea)" },
]

export function PokemonFilters({
  selectedType,
  selectedGeneration,
  onTypeChange,
  onGenerationChange,
}: PokemonFiltersProps) {
  const { types, loading: typesLoading } = useAllTypes()
  const [popularTypes, setPopularTypes] = useState<string[]>([])

  useEffect(() => {
    // Définir les types populaires basés sur l'API
    if (types.length > 0) {
      const popular = ["Feu", "Eau", "Plante", "Électrik", "Psy", "Dragon"]
      setPopularTypes(popular.filter((type) => types.some((apiType) => apiType.name === type)))
    }
  }, [types])

  const clearFilters = () => {
    onTypeChange("")
    onGenerationChange("")
  }

  const hasActiveFilters = selectedType || selectedGeneration

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-1" />
              Effacer
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {selectedType && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Type: {selectedType}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onTypeChange("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {selectedGeneration && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Génération {selectedGeneration}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => onGenerationChange("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Type Filter */}
          <div>
            <label className="text-sm font-medium mb-3 block">Type</label>
            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Generation Filter */}
          <div>
            <label className="text-sm font-medium mb-3 block">Génération</label>
            <Select value={selectedGeneration} onValueChange={onGenerationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une génération" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les générations</SelectItem>
                {generations.map((gen) => (
                  <SelectItem key={gen.value} value={gen.value}>
                    {gen.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Type Filters */}
        {!typesLoading && popularTypes.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-3 block">Types populaires</label>
            <div className="flex flex-wrap gap-2">
              {popularTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => onTypeChange(selectedType === type ? "" : type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
