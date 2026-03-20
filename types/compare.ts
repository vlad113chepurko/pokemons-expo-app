import type { PokemonCardData } from "./pokemon";

export type PokemonStats = {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
};

export type PokemonCompareData = PokemonCardData & {
  types: string[];
  stats: PokemonStats;
};

export type ComparisonResult = {
  winnerByStat: Partial<Record<keyof PokemonStats, "left" | "right" | "tie">>;
  totalLeft: number;
  totalRight: number;
  winnerTotal: "left" | "right" | "tie";
};

export type ComparisonHistoryItem = {
  id: string;
  createdAt: string; 
  left: PokemonCompareData;
  right: PokemonCompareData;
  result: ComparisonResult;
};
