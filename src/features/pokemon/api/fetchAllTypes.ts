import type { TypeApiData } from "@/types/pokemon";

const API_URL = "https://pokebuildapi.fr/api/v1/types";

export async function fetchAllTypes(): Promise<TypeApiData[]> {
  const res = await fetch(API_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch types: ${res.status}`);
  }

  return await res.json();
}
