import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";
import type { PokemonCardData } from "@/types/pokemon";

type Props = {
  pokemon: PokemonCardData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  rightAction?: React.ReactNode;
  index?: number;
  scrollY?: SharedValue<number>; 
};

const CARD_HEIGHT = 88; 

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PokemonCard({
  pokemon,
  isFavorite,
  onToggleFavorite,
  rightAction,
  index = 0,
  scrollY,
}: Props) {
  
  const cardStyle = useAnimatedStyle(() => {
    if (!scrollY) {
      return {};
    }

   
    const positionY = index * CARD_HEIGHT;

    const relativeY = positionY - scrollY.value;


    const translateY = interpolate(
      relativeY,
      [-300, 0, 300],
      [30, 0, -30],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      relativeY,
      [-300, 0, 300],
      [0.94, 1, 0.94],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      relativeY,
      [-400, -200, 0, 200, 400],
      [0, 0.6, 1, 0.6, 0],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  }, [index, scrollY]);

  return (
    <AnimatedPressable
      style={[
        {
          flexDirection: "row",
          gap: 12,
          padding: 12,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: "#2a2a2a",
          backgroundColor: "rgba(10, 10, 18, 0.9)",
          alignItems: "center",
          overflow: "hidden",
        },
        cardStyle,
      ]}
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
        {isFavorite ? (
          <Ionicons name="heart" size={16} color="#fff" />
        ) : (
          <Ionicons name="heart-outline" size={16} color="#fff" />
        )}
      </Pressable>

      {rightAction}
    </AnimatedPressable>
  );
}
