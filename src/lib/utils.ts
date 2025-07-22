// On importe 'clsx', un utilitaire qui permet de construire des chaînes de classes CSS de façon conditionnelle,
// et son type associé 'ClassValue' pour typer proprement les arguments de la fonction.
import { clsx, type ClassValue } from "clsx"

// On importe 'twMerge', qui permet de fusionner correctement les classes Tailwind CSS.
// Par exemple, si tu mets "p-2 p-4", twMerge va garder "p-4" et supprimer "p-2" (c'est la logique de Tailwind !)
import { twMerge } from "tailwind-merge"

// Déclaration d'une fonction utilitaire 'cn' (pour "class name").
// Elle prend un nombre quelconque d'arguments, qui peuvent être des strings, des objets, etc. (grâce à clsx).
export function cn(...inputs: ClassValue[]) {
  // On utilise 'clsx' pour créer une chaîne de classes propre à partir des arguments,
  // puis 'twMerge' pour fusionner intelligemment les classes Tailwind et éviter les doublons ou conflits.
  return twMerge(clsx(inputs))
}
