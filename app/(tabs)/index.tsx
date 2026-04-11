import { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

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

  const scrollY = useSharedValue(0);

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

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const backgroundStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-200, 0, 600],
      [100, 0, -200],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      scrollY.value,
      [-200, 0, 600],
      [1.2, 1, 1],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      scrollY.value,
      [0, 400],
      [1, 0.8],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#02010b" }}>
      {/* Параллакс‑градиент позади всего */}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: -250,
            left: 0,
            right: 0,
            height: 1200,
          },
          backgroundStyle,
        ]}
      >
        <View style={{ flex: 1, backgroundColor: "#08001f" }} />
        <View style={{ flex: 1, backgroundColor: "#14124b" }} />
        <View style={{ flex: 1, backgroundColor: "#3b145c" }} />
        <View style={{ flex: 1, backgroundColor: "#5c1238" }} />
      </Animated.View>

      <View
        style={{
          flex: 1,
          padding: 16,
          gap: 12,
          backgroundColor: "transparent",
        }}
      >
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

        <Animated.FlatList
          data={filtered}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{ gap: 10, paddingVertical: 6 }}
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderItem={({ item, index }) => (
            <PokemonCard
              pokemon={item}
              isFavorite={isFavorite(item.name)}
              onToggleFavorite={() => toggleFavorite(item)}
              index={index}
              scrollY={scrollY} 
            />
          )}
        />
      </View>
    </View>
  );
}
