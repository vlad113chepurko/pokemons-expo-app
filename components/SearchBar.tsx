import { View, TextInput, Text } from "react-native";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChange, placeholder }: Props) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ color: "#bbb" }}>Search</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder ?? "Search by name..."}
        placeholderTextColor="#666"
        autoCapitalize="none"
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
    </View>
  );
}
