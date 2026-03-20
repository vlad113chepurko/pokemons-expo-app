import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import type { PokemonCardData } from "@/types/pokemon";
import { fetchPokemonList, fetchPokemonCardData } from "../../services/pokeapi";
import { PokemonCard } from "../../components/PokemonCard";
import { SearchBar } from "../../components/SearchBar";
import { useFavorites } from "../../store/favorites";

export default function ListScreen() {
  const {
    favorites,
    loading: favLoading,
    isFavorite,
    toggleFavorite,
  } = useFavorites();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<PokemonCardData[]>([]);
  const [query, setQuery] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const list = await fetchPokemonList(60, 0);
        const cards = await Promise.all(
          list.map((x) => fetchPokemonCardData(x.name)),
        );
        if (!cancelled) setItems(cards);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let data = items;

    if (q) data = data.filter((p) => p.name.toLowerCase().includes(q));

    if (onlyFavorites) {
      const favSet = new Set(favorites.map((f) => f.name));
      data = data.filter((p) => favSet.has(p.name));
    }

    return data;
  }, [items, query, onlyFavorites, favorites]);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: "#000" }}>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>
        Pokemon list
      </Text>

      <SearchBar value={query} onChange={setQuery} />

      <Pressable
        onPress={() => setOnlyFavorites((v) => !v)}
        style={{
          padding: 10,
          borderRadius: 12,
          backgroundColor: onlyFavorites ? "#0066ff" : "#1b1b1b",
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: "#fff" }}>
          {onlyFavorites ? "Showing: favorites" : "Filter: Only favorites"}
        </Text>
      </Pressable>

      {(loading || favLoading) && (
        <View style={{ paddingVertical: 24 }}>
          <ActivityIndicator />
        </View>
      )}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ gap: 10, paddingVertical: 6 }}
        renderItem={({ item }) => (
          <PokemonCard
            pokemon={item}
            isFavorite={isFavorite(item.name)}
            onToggleFavorite={() => toggleFavorite(item)}
          />
        )}
      />
    </View>
  );
}
