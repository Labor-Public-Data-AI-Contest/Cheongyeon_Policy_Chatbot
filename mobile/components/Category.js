import { View, Text } from "react-native";

export default function Category({ icon, title }) {
  return (
    <View style={{ alignItems: "center" }}>
      <View style={{
        width: 54,
        height: 54,
        borderRadius: 18,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Text style={{ fontSize: 24 }}>{icon}</Text>
      </View>

      <Text style={{
        marginTop: 9,
        fontWeight: "600"
      }}>
        {title}
      </Text>
    </View>
  );
}