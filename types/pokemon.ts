export type PokemonListItem = {
  name: string;
  url: string;
};

export type PokemonCardData = {
  name: string;
  image: string | null;
};

export type Team = {
  name: string;
  members: PokemonCardData[];
};
