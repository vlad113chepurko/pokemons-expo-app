import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0066ff",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: { backgroundColor: "#000", borderTopColor: "#111" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={size ?? 24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="team"
        options={{
          title: "Team",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              color={color}
              size={size ?? 24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              color={color}
              size={size ?? 24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="compare"
        options={{
          title: "Compare",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "swap-horizontal" : "swap-horizontal-outline"}
              color={color}
              size={size ?? 24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "time" : "time-outline"}
              color={color}
              size={size ?? 24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "cart" : "cart-outline"}
              color={color}
              size={size ?? 24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
