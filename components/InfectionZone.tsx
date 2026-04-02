import React from "react";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

export function InfectionZone({ x, y, size }: any) {
  const pulse = useSharedValue(1);

  pulse.value = withRepeat(withTiming(1.25, { duration: 900 }), -1, true);

  const style = useAnimatedStyle(() => ({
    position: "absolute",
    width: size,
    height: size,
    borderRadius: 999,
    backgroundColor: "rgba(0, 255, 120, 0.08)",
    borderWidth: 2,
    borderColor: "rgba(0, 255, 120, 0.35)",
    shadowColor: "#00ff78",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    transform: [
      { translateX: x - size / 2 },
      { translateY: y - size / 2 },
      { scale: pulse.value },
    ],
  }));

  return <Animated.View style={style} />;
}
