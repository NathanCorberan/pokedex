import { useState, useEffect, useRef } from "react";
import { Search, Menu, Zap, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ModeToggle from "@/components/mode-toggle";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePokemonSearch } from "@/hooks/pokemon/usePokemonSearch";
import { useFavorites } from "@/hooks/use-favorites";

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { results, loading, search } = usePokemonSearch();
  const { count: favoritesCount } = useFavorites();
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        search(searchQuery);
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchClear = () => {
    setSearchQuery("");
    setShowResults(false);
  };

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

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navigationItems = [
    { href: "/", label: "Accueil" },
    { href: "/types", label: "Types" },
    { href: "/favoris", label: `Favoris${favoritesCount > 0 ? ` (${favoritesCount})` : ""}` },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            Pokédex
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`text-sm font-medium transition-colors ${
                isActive(item.href) ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Desktop Search */}
          <div className="hidden md:flex items-center gap-2">
            <div className="relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un Pokémon..."
                className="w-64 pl-10 pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
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

              {/* Results */}
              {showResults && (
                <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto z-50">
                  <CardContent className="p-2">
                    {loading ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">Recherche en cours...</div>
                    ) : results.length > 0 ? (
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
                            <img
                              src={pokemon.image || "/placeholder.svg"}
                              alt={pokemon.name}
                              width={32}
                              height={32}
                              className="rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{pokemon.name}</p>
                              <p className="text-xs text-muted-foreground">
                                #{pokemon.pokedexId.toString().padStart(3, "0")}
                              </p>
                            </div>
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
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Aucun Pokémon trouvé pour "{searchQuery}"
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Mobile search */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search className="h-4 w-4" />
          </Button>

          <ModeToggle />

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
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

      {/* Mobile search bar */}
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
