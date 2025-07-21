import { useEffect, useState, useCallback } from "react";
import { fetchAllTypes } from "@/features/pokemon/api/fetchAllTypes";
import type { TypeApiData } from "@/types/pokemon";

export function useAllTypes() {
  const [types, setTypes] = useState<TypeApiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchAllTypes()
      .then(setTypes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { types, loading, error, refetch: load };
}
