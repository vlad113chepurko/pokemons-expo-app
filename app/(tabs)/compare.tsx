import { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFavorites } from "../../store/favorites";
import { fetchPokemonCompareData } from "../../services/pokeapi";
import type { PokemonCardData } from "../../types/pokemon";
import type { PokemonCompareData } from "../../types/compare";
import { comparePokemons } from "../../utils/compare";
import { useComparisons } from "../../store/comparisons";
import { PokemonCard } from "../../components/PokemonCard";

function StatRow({
  label,
  left,
  right,
}: {
  label: string;
  left: number;
  right: number;
}) {
  const win = left > right ? "left" : right > left ? "right" : "tie";
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
      }}
    >
      <Text style={{ color: "#bbb", width: 120 }}>{label}</Text>
      <Text
        style={{
          color: win === "left" ? "#00d084" : "#fff",
          width: 60,
          textAlign: "right",
        }}
      >
        {left}
      </Text>
      <Text
        style={{
          color: win === "right" ? "#00d084" : "#fff",
          width: 60,
          textAlign: "right",
        }}
      >
        {right}
      </Text>
    </View>
  );
}

export default function CompareScreen() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { addComparison } = useComparisons();

  const [selected, setSelected] = useState<PokemonCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [leftData, setLeftData] = useState<PokemonCompareData | null>(null);
  const [rightData, setRightData] = useState<PokemonCompareData | null>(null);

  const canCompare = selected.length === 2 && !loading;

  const result = useMemo(() => {
    if (!leftData || !rightData) return null;
    return comparePokemons(leftData, rightData);
  }, [leftData, rightData]);

  function toggleSelect(p: PokemonCardData) {
    setLeftData(null);
    setRightData(null);

    setSelected((prev) => {
      const exists = prev.some((x) => x.name === p.name);
      if (exists) return prev.filter((x) => x.name !== p.name);
      if (prev.length >= 2) return prev;
      return [...prev, p];
    });
  }

  async function onCompare() {
    if (selected.length !== 2) return;
    setLoading(true);
    try {
      const [a, b] = selected;
      const [left, right] = await Promise.all([
        fetchPokemonCompareData(a.name),
        fetchPokemonCompareData(b.name),
      ]);
      setLeftData(left);
      setRightData(right);
      await addComparison(left, right);
    } catch (e: any) {
      Alert.alert("Compare", e?.message ?? "Failed to compare");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: "#000" }}>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>
        Compare two favorites
      </Text>

      {favorites.length === 0 ? (
        <Text style={{ color: "#aaa" }}>
          No favorites yet. Go to the list tab and add some Pokémon to favorites
          to compare them here.
        </Text>
      ) : (
        <>
          <Text style={{ color: "#bbb" }}>
            Selected: {selected.map((x) => x.name).join(" vs ") || "none"}
          </Text>

          <Pressable
            onPress={onCompare}
            disabled={!canCompare}
            style={{
              padding: 12,
              borderRadius: 12,
              backgroundColor: canCompare ? "#0066ff" : "#1b1b1b",
              alignSelf: "flex-start",
            }}
          >
            <Text style={{ color: "#fff" }}>
              {loading ? "Loading..." : "Compare"}
            </Text>
          </Pressable>

          {loading && <ActivityIndicator />}

          {result && leftData && rightData && (
            <View
              style={{
                borderWidth: 1,
                borderColor: "#2a2a2a",
                backgroundColor: "#121212",
                borderRadius: 14,
                padding: 12,
                gap: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                Result:{" "}
                {result.winnerTotal === "tie"
                  ? "Tie"
                  : result.winnerTotal === "left"
                    ? leftData.name
                    : rightData.name}
              </Text>

              <Text style={{ color: "#bbb" }}>
                Totals: {leftData.name} {result.totalLeft} - {rightData.name}{" "}
                {result.totalRight}
              </Text>

              <Text style={{ color: "#bbb" }}>
                Types: {leftData.types.join(", ") || "-"} vs{" "}
                {rightData.types.join(", ") || "-"}
              </Text>

              <View style={{ marginTop: 6 }}>
                <StatRow
                  label="HP"
                  left={leftData.stats.hp}
                  right={rightData.stats.hp}
                />
                <StatRow
                  label="Attack"
                  left={leftData.stats.attack}
                  right={rightData.stats.attack}
                />
                <StatRow
                  label="Defense"
                  left={leftData.stats.defense}
                  right={rightData.stats.defense}
                />
                <StatRow
                  label="Sp. Attack"
                  left={leftData.stats.specialAttack}
                  right={rightData.stats.specialAttack}
                />
                <StatRow
                  label="Sp. Defense"
                  left={leftData.stats.specialDefense}
                  right={rightData.stats.specialDefense}
                />
                <StatRow
                  label="Speed"
                  left={leftData.stats.speed}
                  right={rightData.stats.speed}
                />
              </View>
            </View>
          )}

          <FlatList
            data={favorites}
            keyExtractor={(i) => i.name}
            contentContainerStyle={{ gap: 10, paddingVertical: 6 }}
            renderItem={({ item }) => {
              const isSelected = selected.some((x) => x.name === item.name);
              return (
                <Pressable
                  onPress={() => toggleSelect(item)}
                  style={{ opacity: isSelected ? 1 : 0.9 }}
                >
                  <View
                    style={{
                      borderWidth: isSelected ? 1 : 0,
                      borderColor: "#0066ff",
                      borderRadius: 14,
                    }}
                  >
                    <PokemonCard
                      pokemon={item}
                      isFavorite={isFavorite(item.name)}
                      onToggleFavorite={() => toggleFavorite(item)}
                      rightAction={
                        <View
                          style={{ paddingLeft: 8, justifyContent: "center" }}
                        >
                          <Text
                            style={{ color: isSelected ? "#0066ff" : "#666" }}
                          >
                            {isSelected ? "Selected" : "Tap"}
                          </Text>
                        </View>
                      }
                    />
                  </View>
                </Pressable>
              );
            }}
          />
        </>
      )}
    </View>
  );
}
