// --- IMPORTS DES TYPES ET PAGES PRINCIPALES ---
import type { RouteObject } from "react-router-dom" // Le type RouteObject définit la structure d'une route pour React Router
import { Home } from "@/pages/home/home" // Page d'accueil du site
import { FavorisPage } from "@/pages/favoris/favoris-page" // Page des favoris
import { TypesPage } from "@/pages/types/TypesPage" // Page listant tous les types de Pokémon
import { TypeDetailPage } from "@/pages/types/TypeDetailPage" // Page détaillée d'un type de Pokémon

// --- DÉCLARATION DE LA LISTE DES ROUTES ---
export const routes: RouteObject[] = [
  {
    // Route pour l'accueil : correspond à l'URL "/"
    path: "/",
    element: <Home />,
  },
  {
    // Route pour les favoris : correspond à "/favoris"
    path: "/favoris",
    element: <FavorisPage  />,
  },
  {
    // Route pour la liste de tous les types : correspond à "/types"
    path: "/types",
    element: <TypesPage  />,
  },
  {
    // Route dynamique pour un type précis : "/types/:typeName"
    // ":typeName" est un paramètre qui sera remplacé dans l'URL (ex : "/types/Feu")
    path: "/types/:typeName",
    element: <TypeDetailPage />,
  },
];
