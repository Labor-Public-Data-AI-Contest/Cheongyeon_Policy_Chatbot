import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { router } from "expo-router";
import api from "../api/api";
import regionData from "../data/region.json";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "안녕하세요! 거주 지역과 궁금한 정책 분야를 함께 말씀해주시면 더 정확한 청년 정책을 알려드릴 수 있어요. 예: 서울 취업 지원 정책 알려줘"
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const getRegionSuggestions = () => {
    const text = input.trim();
    if (!text) return [];

    const result = new Set();

    Object.entries(regionData).forEach(([sido, districts]) => {
      if (sido.includes(text)) result.add(sido);

      districts.forEach((district) => {
        const full = `${sido} ${district}`;

        if (district.includes(text) || full.includes(text)) {
          result.add(full);
        }
      });
    });

    return [...result].slice(0, 10);
  };

  const filteredRegions = getRegionSuggestions();

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  const sendMessage = async (messageText) => {
    const userMessage = messageText || input;

    if (!userMessage.trim()) return;
    if (loading) return;

    setMessages(prev => [
      ...prev,
      { sender: "user", text: userMessage }
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/api/chat", {
        message: userMessage
      });

      console.log("챗봇 응답:", res.data);

      const botData = res.data;

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: botData?.text || botData?.answer || "응답을 불러왔어요.",
          policies: botData?.policies || [],
          followUp: botData?.followUp || []
        }
      ]);

    } catch (e) {
      console.log("챗봇 오류:", e.response?.data || e.message);

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: "서버 오류가 발생했어요 😢"
        }
      ]);
    } finally {
      setLoading(false);
    }
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
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/");
            }
          }}
        >
          <Text style={{ fontSize: 24 }}>‹</Text>
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
        ref={scrollRef}
        style={{ flex: 1, backgroundColor: "#f8fafc" }}
        contentContainerStyle={{ padding: 18, paddingBottom: 20 }}
      >
        {messages.map((msg, index) => (
          <View key={index} style={{ marginBottom: 14 }}>

            <View
              style={{
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                backgroundColor: msg.sender === "user" ? "#2563eb" : "#ffffff",
                borderWidth: msg.sender === "bot" ? 1 : 0,
                borderColor: "#e5e7eb",
                paddingVertical: 13,
                paddingHorizontal: 15,
                borderRadius: 18,
                maxWidth: "85%"
              }}
            >
              <Text style={{
                color: msg.sender === "user" ? "white" : "#111827",
                lineHeight: 22,
                fontSize: 15
              }}>
                {String(msg.text)}
              </Text>
            </View>

            {msg.policies?.length > 0 && (
              <View style={{ marginTop: 10 }}>
                {msg.policies.map((policy, i) => (
                  <View
                    key={i}
                    style={{
                      backgroundColor: "white",
                      borderRadius: 18,
                      marginTop: 12,
                      borderWidth: 1,
                      borderColor: "#e5e7eb",
                      overflow: "hidden"
                    }}
                  >
                    <View style={{
                      backgroundColor: "#eff6ff",
                      padding: 14
                    }}>
                      <Text style={{
                        color: "#2563eb",
                        fontSize: 16,
                        fontWeight: "900"
                      }}>
                        💡 {policy.title || policy.name || "정책명 없음"}
                      </Text>
                    </View>

                    <View style={{ padding: 14 }}>
                      <Text style={cardLabel}>지원 대상</Text>
                      <Text style={cardText}>
                        {policy.region || policy.target || "정확한 확인이 필요합니다."}
                      </Text>

                      <Text style={cardLabel}>지원 내용</Text>
                      <Text style={cardText}>
                        {policy.amount || policy.content || policy.description || "정확한 확인이 필요합니다."}
                      </Text>

                      <Text style={cardLabel}>신청 기간</Text>
                      <Text style={cardText}>
                        {policy.deadline || "상시 또는 확인 필요"}
                      </Text>

                      {!!policy.reason && (
                        <>
                          <Text style={cardLabel}>추천 이유</Text>
                          <Text style={cardText}>
                            {policy.reason}
                          </Text>
                        </>
                      )}

                      <TouchableOpacity
                        style={{
                          marginTop: 10,
                          height: 46,
                          borderRadius: 12,
                          backgroundColor: "#2563eb",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                      >
                        <Text style={{
                          color: "white",
                          fontWeight: "800"
                        }}>
                          상세 내용 확인하기 〉
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {msg.followUp?.length > 0 && (
              <View style={{ marginTop: 10 }}>
                {msg.followUp.map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => sendMessage(item)}
                    style={{
                      marginTop: 8,
                      borderWidth: 1,
                      borderColor: "#bfdbfe",
                      borderRadius: 14,
                      padding: 13,
                      backgroundColor: "#eff6ff"
                    }}
                  >
                    <Text style={{
                      color: "#2563eb",
                      fontWeight: "800",
                      fontSize: 15
                    }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

        {loading && (
          <View style={{
            alignSelf: "flex-start",
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#e5e7eb",
            paddingVertical: 13,
            paddingHorizontal: 15,
            borderRadius: 18,
            marginBottom: 12,
            maxWidth: "85%"
          }}>
            <Text style={{
              color: "#64748b",
              lineHeight: 22,
              fontSize: 15
            }}>
              정책 정보를 찾고 있어요... 🔎
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={{
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        backgroundColor: "white"
      }}>

        {filteredRegions.length > 0 && (
          <ScrollView horizontal style={{ marginBottom: 10 }}>
            {filteredRegions.map((region, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setInput(region + " ")}
                style={{
                  marginRight: 8,
                  paddingHorizontal: 13,
                  paddingVertical: 8,
                  backgroundColor: "#eff6ff",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: "#bfdbfe"
                }}
              >
                <Text style={{ color: "#2563eb", fontWeight: "800" }}>
                  {region}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
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
            placeholder={loading ? "답변 생성 중..." : "메시지를 입력하세요"}
            placeholderTextColor="#9ca3af"
            editable={!loading}
            style={{
              flex: 1,
              color: "#111",
              fontSize: 15
            }}
          />

          <TouchableOpacity
            onPress={() => sendMessage()}
            disabled={loading}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: loading ? "#cbd5e1" : "#2563eb",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "white", fontWeight: "900" }}>
              {loading ? "…" : "➤"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const cardLabel = {
  color: "#64748b",
  fontSize: 12,
  fontWeight: "700",
  marginTop: 8,
  marginBottom: 4
};

const cardText = {
  color: "#111827",
  fontSize: 14,
  lineHeight: 21,
  marginBottom: 6
};