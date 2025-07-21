export interface Pokemon {
  id: number
  name: string
  types: PokemonType[]
  image: string
  generation: number
  stats: PokemonStats
  height: number
  weight: number
  abilities: string[]
  description: string
  evolutions?: Evolution[]
}

export interface PokemonStats {
  hp: number
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  speed: number
  total: number
}

export interface PokemonType {
  name: string
  color: string
}

export interface Evolution {
  id: number
  name: string
  level?: number
  method: string
  image: string
}

export interface PokemonFilter {
  type?: string
  generation?: number
  search?: string
  sortBy?: "id" | "name" | "stats"
  sortOrder?: "asc" | "desc"
}

export interface PokemonApiResponse {
  pokemon: Pokemon[]
  total: number
  page: number
  hasMore: boolean
}

export const POKEMON_TYPES = [
  "Normal",
  "Feu",
  "Eau",
  "Électrik",
  "Plante",
  "Glace",
  "Combat",
  "Poison",
  "Sol",
  "Vol",
  "Psy",
  "Insecte",
  "Roche",
  "Spectre",
  "Dragon",
  "Ténèbres",
  "Acier",
  "Fée",
] as const

export type PokemonTypeName = (typeof POKEMON_TYPES)[number]

export const TYPE_COLORS: Record<PokemonTypeName, string> = {
  Normal: "#A8A878",
  Feu: "#F08030",
  Eau: "#6890F0",
  Électrik: "#F8D030",
  Plante: "#78C850",
  Glace: "#98D8D8",
  Combat: "#C03028",
  Poison: "#A040A0",
  Sol: "#E0C068",
  Vol: "#A890F0",
  Psy: "#F85888",
  Insecte: "#A8B820",
  Roche: "#B8A038",
  Spectre: "#705898",
  Dragon: "#7038F8",
  Ténèbres: "#705848",
  Acier: "#B8B8D0",
  Fée: "#EE99AC",
}


export interface PokemonApiData {
  id: number
  pokedexId: number
  name: string
  image: string
  sprite: string
  slug: string
  stats: {
    HP: number
    attack: number
    defense: number
    special_attack: number
    special_defense: number
    speed: number
  }
  apiTypes: Array<{
    name: string
    image: string
  }>
  apiGeneration: number
  apiResistances: Array<{
    name: string
    damage_multiplier: number
    damage_relation: string
  }>
  resistanceModifyingAbilitiesForApi: any[]
  apiEvolutions: Array<{
    name: string
    pokedexId: number
  }>
  apiPreEvolution: {
    name: string
    pokedexId: number
  } | null
  apiResistancesWithAbilities: any[]
}

export interface TypeApiData {
  id: number
  name: string
  image: string
  englishName: string
}

export interface PokemonTypeApi {
  name: string;
  id: number;
  image: string;
  pokemon: PokemonApiData[];
}
