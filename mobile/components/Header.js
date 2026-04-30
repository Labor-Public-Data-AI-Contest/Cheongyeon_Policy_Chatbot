import { View, Text } from "react-native";

export default function Header() {
  return (
    <View style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View style={{
          width: 34, height: 34, borderRadius: 17,
          backgroundColor: "#2563eb",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Y</Text>
        </View>
        <Text style={{ fontSize: 18, fontWeight: "800" }}>청년플랫폼</Text>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <Text style={{ fontSize: 22 }}>⌕</Text>
        <Text style={{ fontSize: 22 }}>🔔</Text>
      </View>
    </View>
  );
}