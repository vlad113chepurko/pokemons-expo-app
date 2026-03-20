import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/constants/api";

export function usePokemon(name: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!name) return;
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/pokemon/${name}`)
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, [name]);

  return { data, loading };
}
