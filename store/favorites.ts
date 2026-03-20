import { useEffect, useMemo, useState, useCallback } from "react";
import type { PokemonCardData } from "@/types/pokemon";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { readJSON, writeJSON } from "../utils/storage";

type FavoritesState = {
  favorites: PokemonCardData[];
  loading: boolean;
  isFavorite: (name: string) => boolean;
  addFavorite: (p: PokemonCardData) => Promise<void>;
  removeFavorite: (name: string) => Promise<void>;
  toggleFavorite: (p: PokemonCardData) => Promise<void>;
  reload: () => Promise<void>;
};

export function useFavorites(): FavoritesState {
  const [favorites, setFavorites] = useState<PokemonCardData[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const data = await readJSON<PokemonCardData[]>(STORAGE_KEYS.favorites, []);
    setFavorites(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const isFavorite = useCallback(
    (name: string) => favorites.some((f) => f.name === name),
    [favorites],
  );

  const addFavorite = useCallback(async (p: PokemonCardData) => {
    setFavorites((prev) => {
      if (prev.some((x) => x.name === p.name)) return prev; 
      const next = [p, ...prev];
      void writeJSON(STORAGE_KEYS.favorites, next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback(async (name: string) => {
    setFavorites((prev) => {
      const next = prev.filter((x) => x.name !== name);
      void writeJSON(STORAGE_KEYS.favorites, next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback(
    async (p: PokemonCardData) => {
      if (isFavorite(p.name)) {
        await removeFavorite(p.name);
      } else {
        await addFavorite(p);
      }
    },
    [addFavorite, isFavorite, removeFavorite],
  );

  return useMemo(
    () => ({
      favorites,
      loading,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      reload,
    }),
    [
      favorites,
      loading,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      reload,
    ],
  );
}
