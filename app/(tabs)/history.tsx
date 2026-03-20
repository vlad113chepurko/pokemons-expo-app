import { View, Text, FlatList, Pressable } from "react-native";
import { useComparisons } from "../../store/comparisons";
import { router } from "expo-router";

export default function HistoryScreen() {
  const { history, loading, clearHistory } = useComparisons();

  function handleClear() {
    clearHistory();
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: "#000" }}>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>
        Compare history
      </Text>

      <Pressable
        onPress={handleClear}
        style={{
          padding: 10,
          borderRadius: 12,
          backgroundColor: "#1b1b1b",
          alignSelf: "flex-start",
        }}
      >
        <Text style={{ color: "#fff" }}>Clear history</Text>
      </Pressable>

      {loading ? (
        <Text style={{ color: "#aaa" }}>Loading...</Text>
      ) : history.length === 0 ? (
        <Text style={{ color: "#aaa" }}>No comparisons yet.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ gap: 10, paddingVertical: 6 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/comparison/${item.id}` as any)}
              style={{
                padding: 12,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: "#2a2a2a",
                backgroundColor: "#121212",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                {item.left.name} vs {item.right.name}
              </Text>
              <Text style={{ color: "#bbb" }}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
              <Text style={{ color: "#bbb" }}>
                Winner:{" "}
                {item.result.winnerTotal === "tie"
                  ? "Tie"
                  : item.result.winnerTotal === "left"
                    ? item.left.name
                    : item.right.name}
              </Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
