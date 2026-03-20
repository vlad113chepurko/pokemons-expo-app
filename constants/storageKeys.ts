export const STORAGE_KEYS = {
  favorites: "poke:favorites:v1",
  team: "poke:team:v1",
  comparisons: "poke:comparisons:v1",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
