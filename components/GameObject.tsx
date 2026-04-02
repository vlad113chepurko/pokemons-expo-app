import React from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

export function GameObject({ obj }: any) {
  const style = useAnimatedStyle(() => ({
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#ff3b6b",
    shadowColor: "#ff3b6b",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    transform: [
      { translateX: obj.x.value - 20 },
      { translateY: obj.y.value - 20 },
      { scale: 1 + obj.hit.value * 0.5 },
    ],
  }));

  return <Animated.View style={style} />;
}
