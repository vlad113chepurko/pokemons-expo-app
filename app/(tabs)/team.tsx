import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import { useFavorites } from "../../store/favorites";
import { useTeam } from "../../store/team";
import { PokemonCard } from "../../components/PokemonCard";
import type { PokemonCardData } from "@/types/pokemon";

export default function TeamScreen() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { team, setTeamName, addMember, removeMember, clearTeam } = useTeam();

  const [localName, setLocalName] = useState(team.name);

  const membersSet = useMemo(
    () => new Set(team.members.map((m) => m.name)),
    [team.members],
  );

  async function onAddToTeam(p: PokemonCardData) {
    const res = await addMember(p);
    if (!res.ok) Alert.alert("Team", res.reason ?? "Cannot add");
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, backgroundColor: "#000" }}>
      <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>
        Team Builder
      </Text>

      <View style={{ gap: 6 }}>
        <Text style={{ color: "#bbb" }}>Team name</Text>
        <TextInput
          value={localName}
          onChangeText={setLocalName}
          placeholder="My Team"
          placeholderTextColor="#666"
          style={{
            height: 44,
            borderRadius: 12,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: "#2a2a2a",
            backgroundColor: "#121212",
            color: "#fff",
          }}
        />
        <Pressable
          onPress={() => setTeamName(localName.trim() || "Pokemons Team")}
          style={{
            padding: 10,
            borderRadius: 12,
            backgroundColor: "#0066ff",
            alignSelf: "flex-start",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Ionicons
              style={{
                color: "#fff",
              }}
              name="save"
              size={16}
            />
            <Text
              style={{
                color: "#fff",
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              Save name
            </Text>
          </View>
        </Pressable>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          Current team ({team.members.length}/6)
        </Text>

        {team.members.length === 0 ? (
          <Text style={{ color: "#aaa" }}>
            Team is empty. Add pokemons from favorites or clear team if you want
            to start from scratch.
          </Text>
        ) : (
          <FlatList
            data={team.members}
            keyExtractor={(m) => m.name}
            horizontal
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => (
              <View style={{ width: 260 }}>
                <PokemonCard
                  pokemon={item}
                  isFavorite={isFavorite(item.name)}
                  onToggleFavorite={() => toggleFavorite(item)}
                  rightAction={
                    <Pressable
                      onPress={() => removeMember(item.name)}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 10,
                        borderRadius: 10,
                        backgroundColor: "#2b2b2b",
                      }}
                    >
                      <Text style={{ color: "#fff" }}>Remove</Text>
                    </Pressable>
                  }
                />
              </View>
            )}
          />
        )}

        <Pressable
          onPress={() => clearTeam()}
          style={{
            padding: 10,
            borderRadius: 12,
            backgroundColor: "#1b1b1b",
            alignSelf: "flex-start",
          }}
        >
          <Text style={{ color: "#fff" }}>Clear team</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1, gap: 8 }}>
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
          Favorites
        </Text>

        {favorites.length === 0 ? (
          <Text style={{ color: "#aaa" }}>
            No favorites yet. Mark pokemons as favorite to quickly add them to
          </Text>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.name}
            contentContainerStyle={{ gap: 10, paddingVertical: 6 }}
            renderItem={({ item }) => (
              <View style={{ opacity: membersSet.has(item.name) ? 0.6 : 1 }}>
                <PokemonCard
                  pokemon={item}
                  isFavorite={true}
                  onToggleFavorite={() => toggleFavorite(item)}
                  rightAction={
                    <Pressable
                      onPress={() => onAddToTeam(item)}
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 10,
                        borderRadius: 10,
                        backgroundColor: "#0066ff",
                      }}
                    >
                      <Text style={{ color: "#fff" }}>
                        {membersSet.has(item.name) ? "In team" : "Add"}
                      </Text>
                    </Pressable>
                  }
                />
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}
