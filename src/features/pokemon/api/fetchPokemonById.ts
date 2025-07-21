import type { PokemonApiData } from "@/types/pokemon";

export async function fetchPokemonById(id: number | string): Promise<PokemonApiData | null> {
  try {
    const res = await fetch(`https://pokebuildapi.fr/api/v1/pokemon/${id}`);

    if (!res.ok) {
      console.error(`Erreur ${res.status} pour le Pokémon ID ${id}`);
      return null;
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("❌ Mauvais content-type. Reçu :", contentType);
      return null;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ fetchPokemonById failed:", err);
    return null;
  }
}
