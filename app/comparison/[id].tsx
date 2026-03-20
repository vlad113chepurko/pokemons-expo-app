import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useComparisons } from "../../store/comparisons";

function StatLine({ label, l, r }: { label: string; l: number; r: number }) {
  const win = l > r ? "left" : r > l ? "right" : "tie";
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
        {l}
      </Text>
      <Text
        style={{
          color: win === "right" ? "#00d084" : "#fff",
          width: 60,
          textAlign: "right",
        }}
      >
        {r}
      </Text>
    </View>
  );
}

export default function CompareHistoryDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { history } = useComparisons();

  const item = history.find((x) => x.id === id);

  if (!item) {
    return (
      <View style={{ flex: 1, padding: 16, backgroundColor: "#000" }}>
        <Text style={{ color: "#fff" }}>Not found</Text>
      </View>
    );
  }

  const { left, right, result } = item;

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: "#000" }}>
      <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>
        {left.name} vs {right.name}
      </Text>
      <Text style={{ color: "#bbb" }}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>

      <View
        style={{
          padding: 12,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#2a2a2a",
          backgroundColor: "#121212",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>
          Winner:{" "}
          {result.winnerTotal === "tie"
            ? "Tie"
            : result.winnerTotal === "left"
              ? left.name
              : right.name}
        </Text>
        <Text style={{ color: "#bbb" }}>
          Totals: {left.name} {result.totalLeft} - {right.name}{" "}
          {result.totalRight}
        </Text>
        <Text style={{ color: "#bbb" }}>
          Types: {left.types.join(", ") || "-"} vs{" "}
          {right.types.join(", ") || "-"}
        </Text>

        <View style={{ marginTop: 8 }}>
          <StatLine label="HP" l={left.stats.hp} r={right.stats.hp} />
          <StatLine
            label="Attack"
            l={left.stats.attack}
            r={right.stats.attack}
          />
          <StatLine
            label="Defense"
            l={left.stats.defense}
            r={right.stats.defense}
          />
          <StatLine
            label="Sp. Attack"
            l={left.stats.specialAttack}
            r={right.stats.specialAttack}
          />
          <StatLine
            label="Sp. Defense"
            l={left.stats.specialDefense}
            r={right.stats.specialDefense}
          />
          <StatLine label="Speed" l={left.stats.speed} r={right.stats.speed} />
        </View>
      </View>

      <Pressable
        onPress={() => {}}
        style={{
          padding: 10,
          borderRadius: 12,
          backgroundColor: "#1b1b1b",
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: "#aaa" }}>Saved comparison</Text>
      </Pressable>
    </View>
  );
}
