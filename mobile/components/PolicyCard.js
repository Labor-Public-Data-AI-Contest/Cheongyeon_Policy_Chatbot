import { View, Text, TouchableOpacity } from "react-native";

export default function PolicyCard({
  title,
  desc,
  tag1,
  tag2,
  views,
  active,
  fixedHeight,
  onPress,
}) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 18,
          padding: 18,
          borderWidth: active ? 2 : 0,
          borderColor: active ? "#2563eb" : "transparent",
          height: fixedHeight ? 200 : undefined,
          justifyContent: fixedHeight ? "space-between" : "flex-start",
        }}
      >
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Text
            numberOfLines={1}
            style={{
              backgroundColor: "#eff6ff",
              color: "#2563eb",
              padding: 6,
              borderRadius: 8,
              fontWeight: "700",
            }}
          >
            {tag1}
          </Text>

          <Text
            numberOfLines={1}
            style={{
              backgroundColor: "#f1f5f9",
              padding: 6,
              borderRadius: 8,
              fontWeight: "700",
              maxWidth: 130,
            }}
          >
            {tag2}
          </Text>
        </View>

        <Text
          numberOfLines={2}
          style={{
            fontSize: 17,
            fontWeight: "900",
            marginTop: 12,
          }}
        >
          {title}
        </Text>

        <Text
          numberOfLines={fixedHeight ? 2 : 4}
          style={{
            color: "#64748b",
            marginTop: 8,
            lineHeight: 22,
          }}
        >
          {desc}
        </Text>

        <Text style={{ marginTop: 10 }}>👁 {views}</Text>
      </View>
    </TouchableOpacity>
  );
}