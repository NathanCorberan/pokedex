// On importe tout React, ce qui permet d'utiliser useState, useEffect, etc.
import * as React from "react"

// On définit la largeur du breakpoint mobile (en pixels, ici 768px, standard Tailwind/Bootstrap)
const MOBILE_BREAKPOINT = 768

// Déclaration d’un hook personnalisé qui permet de savoir si l’utilisateur est sur mobile ou non
export function useIsMobile() {
  // On déclare un état local, qui peut être "true" (mobile), "false" (desktop), ou "undefined" au départ.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  // On utilise useEffect pour ne lancer le code que côté client (jamais au SSR), et seulement une fois au montage
  React.useEffect(() => {
    // On crée un MediaQueryList pour détecter si la fenêtre fait moins de 768px de large
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // Fonction qui sera appelée quand la largeur de la fenêtre change de côté du breakpoint
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // On écoute les changements du media query (resize, rotation, etc.)
    mql.addEventListener("change", onChange)

    // On initialise la valeur dès le début (pour prendre la largeur courante)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Nettoyage de l'écouteur d'événement à la destruction du composant
    return () => mql.removeEventListener("change", onChange)
  }, []) // Tableau vide = effet lancé une seule fois au montage

  // On retourne "true" si mobile, "false" sinon (et "false" tant que c'est undefined)
  return !!isMobile
}
