// Importation des hooks React et de divers composants externes utilisés dans le header.
import { useState, useEffect, useRef } from "react";
// Icônes utilisées dans l'UI, provenant de la librairie lucide-react
import { Search, Menu, Zap, X } from "lucide-react";
// Utilitaires pour la navigation avec React Router
import { Link, useLocation } from "react-router-dom";
// Composants personnalisés UI pour boutons, champs d'input, badge, etc.
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ModeToggle from "@/components/mode-toggle";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Hooks personnalisés pour la recherche et la gestion des favoris
import { usePokemonSearch } from "@/hooks/pokemon/usePokemonSearch";
import { useFavorites } from "@/hooks/use-favorites";

// Déclaration du composant principal Header
export function Header() {
  // --- 1. GESTION DES ÉTATS LOCAUX AVEC useState ---
  // Contrôle l'ouverture/fermeture de la barre de recherche mobile
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // Contenu du champ de recherche
  const [searchQuery, setSearchQuery] = useState("");
  // Affichage (ou non) de la liste de résultats de recherche
  const [showResults, setShowResults] = useState(false);

  // --- 2. HOOKS PERSONNALISÉS ---
  // Permet d'accéder aux résultats de la recherche, à l'état de chargement et à la fonction de recherche
  const { results, loading, search } = usePokemonSearch();
  // Récupère le nombre de favoris depuis le contexte/fonctionalité de favoris
  const { count: favoritesCount } = useFavorites();

  // useRef pour détecter les clics en dehors de la boîte de recherche (pour la fermer)
  const searchRef = useRef<HTMLDivElement>(null);

  // Permet de récupérer l'URL courante et d'activer le menu correspondant
  const location = useLocation();

  // --- 3. EFFETS SECONDAIRES AVEC useEffect ---

  // Lancer une recherche avec un délai de 300ms après la dernière saisie (évite trop de requêtes)
  useEffect(() => {
    // Lance la recherche seulement si la requête n'est pas vide
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        search(searchQuery);
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    }, 300); // délai de 300ms

    // Nettoyage du timeout à chaque changement
    return () => clearTimeout(delayedSearch);
  }, [searchQuery, search]);

  // Ferme la liste des résultats si on clique en dehors de la zone de recherche
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    // Nettoyage de l'écouteur d'événements au démontage
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fonction pour effacer la recherche et masquer les résultats
  const handleSearchClear = () => {
    setSearchQuery("");
    setShowResults(false);
  };

  // --- 4. TABLEAU DE COULEURS PAR TYPE DE POKÉMON ---
  // Permet d'afficher des badges de couleur différente selon le type du Pokémon
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
  };

  // Vérifie si le lien est actif (pour le style du menu de navigation)
  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // --- 5. DÉFINITION DES ÉLÉMENTS DE NAVIGATION ---
  // Liste des liens à afficher dans le menu, incluant le nombre de favoris s'il y en a
  const navigationItems = [
    { href: "/", label: "Accueil" },
    { href: "/types", label: "Types" },
    { href: "/favoris", label: `Favoris${favoritesCount > 0 ? ` (${favoritesCount})` : ""}` },
  ];

  // --- 6. RENDU JSX ---

  return (
    // Le header est sticky (collé en haut), a un fond semi-transparent et un effet de flou
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* LOGO ET TITRE DU SITE */}
        <Link to="/" className="flex items-center gap-2">
          {/* Petit logo Pokédex stylisé */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          {/* Titre Pokédex avec dégradé */}
          <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            Pokédex
          </span>
        </Link>

        {/* NAVIGATION PRINCIPALE - visible sur desktop uniquement */}
        <nav className="hidden md:flex items-center gap-6">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              // Style dynamique selon l'URL active
              className={`text-sm font-medium transition-colors ${
                isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ZONE DE RECHERCHE + BOUTONS */}
        <div className="flex items-center gap-2">
          {/* BARRE DE RECHERCHE DESKTOP */}
          <div className="hidden md:flex items-center gap-2">
            {/* searchRef permet de gérer le clic en dehors */}
            <div className="relative" ref={searchRef}>
              {/* Icône loupe (décorative, en absolute) */}
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              {/* Champ de recherche */}
              <Input
                placeholder="Rechercher un Pokémon..."
                className="w-64 pl-10 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
              />
              {/* Bouton pour effacer la recherche */}
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
                  onClick={handleSearchClear}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}

              {/* AFFICHAGE DES RÉSULTATS DE RECHERCHE */}
              {showResults && (
                <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto z-50">
                  <CardContent className="p-2">
                    {loading ? (
                      // Pendant le chargement
                      <div className="p-4 text-center text-sm text-muted-foreground">Recherche en cours...</div>
                    ) : results.length > 0 ? (
                      // Si des résultats existent
                      <div className="space-y-2">
                        {results.map((pokemon) => (
                          <div
                            key={pokemon.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer"
                            onClick={() => {
                              setShowResults(false);
                              setSearchQuery("");
                            }}
                          >
                            {/* Image du Pokémon */}
                            <img
                              src={pokemon.image || "/placeholder.svg"}
                              alt={pokemon.name}
                              width={32}
                              height={32}
                              className="rounded"
                            />
                            {/* Nom et numéro du Pokédex */}
                            <div className="flex-1">
                              <p className="font-medium text-sm">{pokemon.name}</p>
                              <p className="text-xs text-muted-foreground">
                                #{pokemon.pokedexId.toString().padStart(3, "0")}
                              </p>
                            </div>
                            {/* Affichage des types du Pokémon sous forme de badges */}
                            <div className="flex gap-1">
                              {pokemon.apiTypes.slice(0, 2).map((type) => (
                                <Badge
                                  key={type.name}
                                  className={`${typeColors[type.name] || "bg-gray-500"} text-white text-xs`}
                                >
                                  {type.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Si aucun résultat
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Aucun Pokémon trouvé pour "{searchQuery}"
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* ICÔNE RECHERCHE MOBILE (affiche la barre de recherche sur mobile) */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-4 w-4" />
          </Button>

          {/* BOUTON DARK/LIGHT MODE */}
          <ModeToggle />

          {/* MENU BURGER POUR MOBILE */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            {/* Menu qui s'ouvre à droite */}
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-4 mt-8">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`text-lg font-medium transition-colors ${
                      isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* BARRE DE RECHERCHE MOBILE - visible seulement si isSearchOpen est vrai */}
      {isSearchOpen && (
        <div className="border-t p-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un Pokémon..."
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
                onClick={handleSearchClear}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
