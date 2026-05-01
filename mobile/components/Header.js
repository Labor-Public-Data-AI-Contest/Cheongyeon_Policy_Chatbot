import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

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

      <View style={{ flexDirection: "row", gap: 5 }}>
        <Text style={{ fontSize: 20, marginRight: 14 }}>🔔</Text>

        <TouchableOpacity
          style={{ paddingHorizontal: 6 }}
          onPress={() => router.push("/login")}
        >
          <Text style={{
            color: "#2563eb",
            fontWeight: "700",
            fontSize: 15
          }}>
            로그인
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}