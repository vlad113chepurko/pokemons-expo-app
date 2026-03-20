import { useMemo, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useFavorites } from "../../store/favorites";
import { PokemonCard } from "../../components/PokemonCard";
import { SearchBar } from "../../components/SearchBar";

export default function FavoritesScreen() {
  const { favorites, loading, isFavorite, toggleFavorite } = useFavorites();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return favorites;
    return favorites.filter((p) => p.name.toLowerCase().includes(q));
  }, [favorites, query]);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: "#000" }}>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>
        Favorites
      </Text>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search favorites..."
      />

      {loading ? (
        <Text style={{ color: "#aaa" }}>Loading...</Text>
      ) : filtered.length === 0 ? (
        <Text style={{ color: "#aaa" }}>No favorites yet.</Text>
      ) : (
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
      )}
    </View>
  );
}
