import type {
  ComparisonResult,
  PokemonCompareData,
  PokemonStats,
} from "../types/compare";

const STAT_KEYS: (keyof PokemonStats)[] = [
  "hp",
  "attack",
  "defense",
  "specialAttack",
  "specialDefense",
  "speed",
];

export function comparePokemons(
  left: PokemonCompareData,
  right: PokemonCompareData,
): ComparisonResult {
  const winnerByStat: ComparisonResult["winnerByStat"] = {};

  let totalLeft = 0;
  let totalRight = 0;

  for (const k of STAT_KEYS) {
    const lv = left.stats[k] ?? 0;
    const rv = right.stats[k] ?? 0;

    totalLeft += lv;
    totalRight += rv;

    if (lv > rv) winnerByStat[k] = "left";
    else if (rv > lv) winnerByStat[k] = "right";
    else winnerByStat[k] = "tie";
  }

  const winnerTotal =
    totalLeft > totalRight ? "left" : totalRight > totalLeft ? "right" : "tie";

  return { winnerByStat, totalLeft, totalRight, winnerTotal };
}
