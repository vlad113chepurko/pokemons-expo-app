import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

import { Explosion } from "../../components/Explosion";
import { GameObject } from "../../components/GameObject";
import { InfectionZone } from "../../components/InfectionZone";

const { width, height } = Dimensions.get("window");

const BALL_SIZE = 60;
const OBJECTS = 6;

const SPEED = 4;
const FRICTION = 0.88;

export default function CartScreen() {
  const x = useSharedValue(width / 2);
  const y = useSharedValue(height / 2);

  const vx = useSharedValue(0);
  const vy = useSharedValue(0);

  const [explosions, setExplosions] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [dead, setDead] = useState<Set<number>>(new Set());

  const objects = Array.from({ length: OBJECTS }).map((_, i) => ({
    id: i,
    x: useSharedValue(Math.random() * width),
    y: useSharedValue(Math.random() * height),
    hit: useSharedValue(0),
  }));

  useEffect(() => {
    const keys = new Set<string>();

    const down = (e: KeyboardEvent) => keys.add(e.key);
    const up = (e: KeyboardEvent) => keys.delete(e.key);

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    const loop = setInterval(() => {
      let ax = 0;
      let ay = 0;

      if (keys.has("ArrowUp")) ay -= SPEED;
      if (keys.has("ArrowDown")) ay += SPEED;
      if (keys.has("ArrowLeft")) ax -= SPEED;
      if (keys.has("ArrowRight")) ax += SPEED;

      vx.value = (vx.value + ax) * FRICTION;
      vy.value = (vy.value + ay) * FRICTION;

      vx.value = Math.max(-3.5, Math.min(3.5, vx.value));
      vy.value = Math.max(-3.5, Math.min(3.5, vy.value));

      x.value += vx.value;
      y.value += vy.value;

      x.value = Math.max(30, Math.min(width - 30, x.value));
      y.value = Math.max(30, Math.min(height - 30, y.value));

      objects.forEach((o) => {
        if (dead.has(o.id)) return;

        const dx = o.x.value - x.value;
        const dy = o.y.value - y.value;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 45) {
          setDead((prev) => new Set(prev).add(o.id));

          o.hit.value = withTiming(1, { duration: 120 });
          o.hit.value = withTiming(0, { duration: 400 });

          setExplosions((p) => [
            ...p,
            { x: o.x.value, y: o.y.value, id: Math.random() },
          ]);

          setZones((p) => [
            ...p,
            { x: o.x.value, y: o.y.value, id: Math.random() },
          ]);
        }
      });

      zones.forEach((z) => {
        const dx = x.value - z.x;
        const dy = y.value - z.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d < 90) {
          const nx = dx / d;
          const ny = dy / d;

          x.value += nx * 2.5;
          y.value += ny * 2.5;

          vx.value *= 0.8;
          vy.value *= 0.8;
        }
      });
    }, 16);

    return () => clearInterval(loop);
  }, [dead, zones]);

  const ballStyle = useAnimatedStyle(() => ({
    position: "absolute",
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: 30,
    backgroundColor: "#00e0ff",
    shadowColor: "#00e0ff",
    shadowOpacity: 1,
    shadowRadius: 30,
    transform: [
      { translateX: x.value - BALL_SIZE / 2 },
      { translateY: y.value - BALL_SIZE / 2 },
    ],
  }));

  return (
    <View style={styles.container}>
      {/* ☢️ зоны */}
      {zones.map((z) => (
        <InfectionZone key={z.id} x={z.x} y={z.y} size={160} />
      ))}

      {/* 💥 взрывы */}
      {explosions.map((e) => (
        <Explosion
          key={e.id}
          x={e.x}
          y={e.y}
          onEnd={() => setExplosions((p) => p.filter((x) => x.id !== e.id))}
        />
      ))}

      {/* 🟥 объекты (не мёртвые) */}
      {objects
        .filter((o) => !dead.has(o.id))
        .map((o) => (
          <GameObject key={o.id} obj={o} />
        ))}

      {/* 🔵 шар */}
      <Animated.View style={ballStyle} />

      {/* ✨ ХВОСТ (новый стабильный) */}
      <Animated.View
        style={[
          styles.trail,
          useAnimatedStyle(() => ({
            position: "absolute",
            width: 18,
            height: 18,
            borderRadius: 50,
            backgroundColor: "#00e0ff",
            opacity: 0.4,
            transform: [
              { translateX: x.value - 9 - vx.value * 6 },
              { translateY: y.value - 9 - vy.value * 6 },
            ],
          })),
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050510",
    overflow: "hidden",
  },
  trail: {},
});
