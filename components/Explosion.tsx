import React, { useEffect } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export function Explosion({ x, y, onEnd }: any) {
  const p = useSharedValue(0);

  useEffect(() => {
    p.value = withTiming(1, { duration: 450 }, (f) => {
      if (f) onEnd?.();
    });
  }, []);

  const style = useAnimatedStyle(() => ({
    position: "absolute",
    left: x,
    top: y,
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#00e0ff",
    transform: [
      {
        scale: interpolate(p.value, [0, 1], [1, 14]),
      },
    ],
    opacity: interpolate(p.value, [0, 1], [0.9, 0]),
    shadowColor: "#00e0ff",
    shadowRadius: 25,
  }));

  return <Animated.View style={style} />;
}
