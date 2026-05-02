import { View, Text } from "react-native";

export default function PolicyCard({ title, desc, tag1, tag2, views, active }) {
  return (
    
    <View style={{
      backgroundColor: "white",
      borderRadius: 18,
      padding: 18,
      borderWidth: active ? 2 : 0,
      borderColor: active ? "#2563eb" : "transparent"
    }}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Text style={{
          backgroundColor: "#eff6ff",
          color: "#2563eb",
          padding: 6,
          borderRadius: 8
        }}>
          {tag1}
        </Text>
        <Text style={{
          backgroundColor: "#f1f5f9",
          padding: 6,
          borderRadius: 8
        }}>
          {tag2}
        </Text>
      </View>

      <Text style={{
        fontSize: 17,
        fontWeight: "900",
        marginTop: 12
      }}>
        {title}
      </Text>

      <Text style={{
        color: "#64748b",
        marginTop: 8
      }}>
        {desc}
      </Text>

      <Text style={{ marginTop: 10 }}>
        👁 {views}
      </Text>
    </View>
  );
}