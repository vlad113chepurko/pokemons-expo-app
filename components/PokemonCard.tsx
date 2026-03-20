import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { PokemonCardData } from "@/types/pokemon";

type Props = {
  pokemon: PokemonCardData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  rightAction?: React.ReactNode;
};

export function PokemonCard({
  pokemon,
  isFavorite,
  onToggleFavorite,
  rightAction,
}: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#2a2a2a",
        backgroundColor: "#121212",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 12,
          backgroundColor: "#1b1b1b",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {pokemon.image ? (
          <Image
            source={{ uri: pokemon.image }}
            style={{ width: 64, height: 64 }}
            resizeMode="contain"
          />
        ) : (
          <Text style={{ color: "#888" }}>No img</Text>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          {pokemon.name}
        </Text>
      </View>

      <Pressable
        onPress={onToggleFavorite}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 10,
          borderRadius: 10,
          backgroundColor: isFavorite ? "#ff2d55" : "#2b2b2b",
        }}
      >
        <Text style={{ color: "#fff" }}>
          {isFavorite ? (
            <Ionicons name="heart" size={16} color="#fff" />
          ) : (
            <Ionicons name="heart-outline" size={16} color="#fff" />
          )}
        </Text>
      </Pressable>

      {rightAction}
    </View>
  );
}
