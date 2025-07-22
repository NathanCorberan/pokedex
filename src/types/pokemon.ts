// --- INTERFACE PRINCIPALE POUR UN POKÉMON INTERNE ---
// Structure utilisée dans l'application pour représenter un Pokémon complet (non API)
export interface Pokemon {
  id: number                     // Identifiant unique interne
  name: string                   // Nom du Pokémon
  types: PokemonType[]           // Tableau des types du Pokémon (ex: Feu, Eau)
  image: string                  // URL de l'image officielle
  generation: number             // Numéro de génération (ex: 1 pour Kanto)
  stats: PokemonStats            // Statistiques du Pokémon (voir ci-dessous)
  height: number                 // Taille en décimètres
  weight: number                 // Poids en hectogrammes
  abilities: string[]            // Capacités spéciales (noms)
  description: string            // Description du Pokédex ou custom
  evolutions?: Evolution[]       // Évolutions (peut être absent)
}

// --- INTERFACE POUR LES STATS D’UN POKÉMON ---
// Structure détaillée des statistiques de base
export interface PokemonStats {
  hp: number             // Points de vie
  attack: number         // Attaque
  defense: number        // Défense
  specialAttack: number  // Attaque Spéciale
  specialDefense: number // Défense Spéciale
  speed: number          // Vitesse
  total: number          // Total de toutes les stats
}

// --- TYPE POUR UN TYPE DE POKÉMON (INTERNE) ---
export interface PokemonType {
  name: string           // Nom du type (ex: "Feu", "Eau")
  color: string          // Couleur associée pour affichage
}

// --- STRUCTURE D’UNE ÉVOLUTION ---
export interface Evolution {
  id: number             // Identifiant du Pokémon d'évolution
  name: string           // Nom du Pokémon d'évolution
  level?: number         // Niveau d’évolution (optionnel)
  method: string         // Méthode d’évolution (ex: "Niveau", "Pierre Feu")
  image: string          // Image du Pokémon d’évolution
}

// --- FILTRE POUR LA RECHERCHE OU LE TRI DES POKÉMONS ---
export interface PokemonFilter {
  type?: string                         // Filtrer par type (ex: "Eau")
  generation?: number                   // Filtrer par génération (1, 2, ...)
  search?: string                       // Recherche par nom ou autre critère
  sortBy?: "id" | "name" | "stats"      // Critère de tri principal
  sortOrder?: "asc" | "desc"            // Ordre du tri
}

// --- RÉPONSE STANDARD DE L’API POUR LES LISTES DE POKÉMONS ---
export interface PokemonApiResponse {
  pokemon: Pokemon[]    // Tableau de Pokémon retournés
  total: number         // Nombre total de Pokémon (tous pages confondues)
  page: number          // Page actuelle
  hasMore: boolean      // S’il y a d’autres pages à charger
}

// --- LISTE DES TYPES POKÉMON CANONIQUES (string literal types) ---
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

// --- TYPE DÉRIVÉ : NOM D’UN TYPE DE POKÉMON (littéral, pas n'importe quelle string !) ---
export type PokemonTypeName = (typeof POKEMON_TYPES)[number]
// Usage : const monType: PokemonTypeName = "Feu" // OK, "NoixDeCoco" // erreur

// --- COULEUR HEX DÉDIÉE À CHAQUE TYPE ---
// Utilisé pour la couleur principale du badge, du fond, etc.
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

// --- STRUCTURE POUR UN POKÉMON TEL QUE RETOURNÉ PAR L’API EXTERNE ---
// Attention : légèrement différente du modèle "interne"
export interface PokemonApiData {
  id: number
  pokedexId: number                           // Numéro officiel du Pokédex
  name: string
  image: string                               // Image principale
  sprite: string                              // Sprite simplifié/miniature
  slug: string                                // Slug URL-friendly
  stats: {
    HP: number
    attack: number
    defense: number
    special_attack: number
    special_defense: number
    speed: number
  }
  apiTypes: Array<{
    name: string                              // Nom du type (ex: "Eau")
    image: string                             // Image du type
  }>
  apiGeneration: number                       // Génération
  apiResistances: Array<{
    name: string
    damage_multiplier: number                 // x0.5, x2, etc.
    damage_relation: string                   // "faible", "résistant"
  }>
  resistanceModifyingAbilitiesForApi: any[]   // Pour extensions (non typé ici)
  apiEvolutions: Array<{
    name: string
    pokedexId: number
  }>
  apiPreEvolution: {
    name: string
    pokedexId: number
  } | null
  apiResistancesWithAbilities: any[]          // (souvent non utilisé)
}

// --- STRUCTURE POUR UN TYPE RETOURNÉ PAR L’API ---
// Peut servir pour l’affichage ou la navigation
export interface TypeApiData {
  id: number
  name: string
  image: string
  englishName: string
}

// --- STRUCTURE POUR UN TYPE AVEC LA LISTE DE TOUS LES POKÉMON DE CE TYPE ---
// Peut être utilisé pour les routes détaillées
export interface PokemonTypeApi {
  name: string;
  id: number;
  image: string;
  pokemon: PokemonApiData[];
}
