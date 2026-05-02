import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { router } from "expo-router";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "안녕하세요! 원하는 청년 정책을 정확히 찾아드리기 위해 몇 가지 정보가 더 필요해요."
    }
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages(prev => [
      ...prev,
      { sender: "user", text: input },
      { sender: "bot", text: "선택해주시면 다음 단계로 진행해드릴게요." }
    ]);

    setInput("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{
        height: 70,
        paddingHorizontal: 20,
        paddingTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        flexDirection: "row",
        alignItems: "center"
      }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 28 }}>‹</Text>
        </TouchableOpacity>

        <Text style={{
          flex: 1,
          textAlign: "center",
          fontSize: 17,
          fontWeight: "900",
          marginRight: 28
        }}>
          청년정책 AI 봇
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 18, paddingBottom: 20 }}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#2563eb" : "#ffffff",
              borderWidth: msg.sender === "bot" ? 1 : 0,
              borderColor: "#e5e7eb",
              paddingVertical: 13,
              paddingHorizontal: 15,
              borderRadius: 18,
              marginBottom: 12,
              maxWidth: "82%"
            }}
          >
            <Text style={{
              color: msg.sender === "user" ? "white" : "#111827",
              lineHeight: 22
            }}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={{
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb"
      }}>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#f8fafc",
          borderRadius: 24,
          paddingHorizontal: 16,
          height: 54
        }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="메시지를 입력하세요"
            placeholderTextColor="#9ca3af"
            style={{ flex: 1, color: "#111", fontSize: 15 }}
          />

          <TouchableOpacity
            onPress={sendMessage}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#2563eb",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "white", fontWeight: "900" }}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}