import { useCallback, useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { readJSON, writeJSON } from "../utils/storage";
import type {
  ComparisonHistoryItem,
  PokemonCompareData,
} from "../types/compare";
import { comparePokemons } from "../utils/compare";

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

type ComparisonsState = {
  history: ComparisonHistoryItem[];
  loading: boolean;
  addComparison: (
    left: PokemonCompareData,
    right: PokemonCompareData,
  ) => Promise<ComparisonHistoryItem>;
  clearHistory: () => Promise<void>;
  reload: () => Promise<void>;
};

export function useComparisons(): ComparisonsState {
  const [history, setHistory] = useState<ComparisonHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const data = await readJSON<ComparisonHistoryItem[]>(
      STORAGE_KEYS.comparisons,
      [],
    );
    setHistory(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addComparison = useCallback(
    async (left: PokemonCompareData, right: PokemonCompareData) => {
      const item: ComparisonHistoryItem = {
        id: makeId(),
        createdAt: new Date().toISOString(),
        left,
        right,
        result: comparePokemons(left, right),
      };

      setHistory((prev) => {
        const next = [item, ...prev].slice(0, 50);
        void writeJSON(STORAGE_KEYS.comparisons, next);
        return next;
      });

      return item;
    },
    [],
  );

  const clearHistory = useCallback(async () => {
    setHistory([]);
    await writeJSON(STORAGE_KEYS.comparisons, []);
  }, []);

  return useMemo(
    () => ({ history, loading, addComparison, clearHistory, reload }),
    [history, loading, addComparison, clearHistory, reload],
  );
}
