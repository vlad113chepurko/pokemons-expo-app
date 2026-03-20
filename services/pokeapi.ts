import axios from "axios";
import type { PokemonListItem, PokemonCardData } from "../types/pokemon";
import type { PokemonCompareData, PokemonStats } from "../types/compare";

const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

export async function fetchPokemonList(limit = 60, offset = 0) {
  const res = await api.get("/pokemon", { params: { limit, offset } });
  return res.data.results as PokemonListItem[];
}

export async function fetchPokemonCardData(
  name: string,
): Promise<PokemonCardData> {
  const res = await api.get(`/pokemon/${name}`);
  const sprite =
    res.data?.sprites?.other?.["official-artwork"]?.front_default ??
    res.data?.sprites?.front_default ??
    null;

  return { name: res.data.name, image: sprite };
}

function getStat(statsArr: any[], statName: string): number {
  const found = statsArr?.find((s) => s?.stat?.name === statName);
  return typeof found?.base_stat === "number" ? found.base_stat : 0;
}

export async function fetchPokemonCompareData(
  name: string,
): Promise<PokemonCompareData> {
  const res = await api.get(`/pokemon/${name}`);
  const sprite =
    res.data?.sprites?.other?.["official-artwork"]?.front_default ??
    res.data?.sprites?.front_default ??
    null;

  const stats: PokemonStats = {
    hp: getStat(res.data.stats, "hp"),
    attack: getStat(res.data.stats, "attack"),
    defense: getStat(res.data.stats, "defense"),
    specialAttack: getStat(res.data.stats, "special-attack"),
    specialDefense: getStat(res.data.stats, "special-defense"),
    speed: getStat(res.data.stats, "speed"),
  };

  const types: string[] = (res.data.types ?? [])
    .map((t: any) => t?.type?.name)
    .filter(Boolean);

  return {
    name: res.data.name,
    image: sprite,
    types,
    stats,
  };
}
