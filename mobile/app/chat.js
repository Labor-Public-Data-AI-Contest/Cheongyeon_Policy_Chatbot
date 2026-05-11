import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import regionData from "../data/region.json";

const API_BASE_URL = "http://127.0.0.1:8000";
const CHAT_API_URL = `${API_BASE_URL}/api/chat`;
const CLARIFY_API_URL = `${API_BASE_URL}/api/chat/clarify`;

const getClarificationQuestions = (botData) => {
  if (botData?.questions?.length > 0) return botData.questions;
  if (botData?.clarification?.questions?.length > 0) {
    return botData.clarification.questions;
  }
  if (botData?.clarification_plan?.questions?.length > 0) {
    return botData.clarification_plan.questions;
  }
  if (botData?.result?.clarification_plan?.questions?.length > 0) {
    return botData.result.clarification_plan.questions;
  }
  return [];
};

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "안녕하세요. 지역에 맞는 정책 안내를 위해 주민등록상 거주지 알려주세요. 😊",
      regionForm: true,
    },
  ]);

  const [input, setInput] = useState("");
  const [sidoInput, setSidoInput] = useState("");
  const [districtInput, setDistrictInput] = useState("");
  const [residenceRegion, setResidenceRegion] = useState(null);
  const [activeRegionField, setActiveRegionField] = useState(null);
  const [selectedQuestionAnswers, setSelectedQuestionAnswers] = useState({});
  const [submittedQuestionMessages, setSubmittedQuestionMessages] = useState(
    {},
  );
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const buildBotMessage = (botData, fallbackText) => {
    const questions = getClarificationQuestions(botData);

    return {
      sender: "bot",
      text:
        botData?.answer ||
        botData?.text ||
        botData?.message ||
        botData?.clarification?.recommendation_goal ||
        botData?.recommendation_goal ||
        botData?.clarification_plan?.recommendation_goal ||
        botData?.result?.clarification_plan?.recommendation_goal ||
        fallbackText,
      policies: botData?.policies || [],
      followUp: botData?.followUp || [],
      questions,
      sessionId: botData?.sessionId,
    };
  };

  const getSidoSuggestions = () => {
    const text = sidoInput.trim();
    if (!text) return [];

    return Object.keys(regionData)
      .filter((sido) => sido.includes(text))
      .slice(0, 10);
  };

  const getDistrictSuggestions = () => {
    const text = districtInput.trim();
    if (!text) return [];

    const selectedDistricts = regionData[sidoInput.trim()];
    const districtPool = selectedDistricts || Object.values(regionData).flat();
    const result = new Set();

    districtPool.forEach((district) => {
      if (district.includes(text)) result.add(district);
    });

    return [...result].slice(0, 10);
  };

  const sidoSuggestions =
    activeRegionField === "sido" ? getSidoSuggestions() : [];
  const districtSuggestions =
    activeRegionField === "district" ? getDistrictSuggestions() : [];

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  const saveResidenceRegion = () => {
    const sido = sidoInput.trim();
    const district = districtInput.trim();

    if (!sido || !district) return;

    if (!regionData[sido]) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "시/도를 자동완성 목록에서 선택하거나 정확한 이름으로 입력해주세요.",
        },
      ]);
      return;
    }

    if (!regionData[sido].includes(district)) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: `${sido}에 포함된 구/시/군을 입력해주세요.`,
        },
      ]);
      return;
    }

    const region = `${sido} ${district}`;
    setResidenceRegion(region);
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: region },
      {
        sender: "bot",
        text: "감사합니다. 궁금한 정책이나 필요한 지원을 말씀해주세요.",
      },
    ]);
  };

  const sendMessage = async (messageText) => {
    const userMessage = messageText || input;

    if (!userMessage.trim()) return;
    if (loading) return;

    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: residenceRegion
            ? `${residenceRegion} ${userMessage}`
            : userMessage,
          region: residenceRegion,
        }),
      });

      if (!res.ok) {
        throw new Error(`Chat API error: ${res.status}`);
      }

      const botData = await res.json();

      console.log("챗봇 응답:", botData);

      setMessages((prev) => [
        ...prev,
        buildBotMessage(botData, "추가 정보가 필요해요."),
      ]);
    } catch (e) {
      console.log("챗봇 오류:", e.message);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "서버 오류가 발생했어요 😢",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getQuestionKey = (messageIndex, question, questionIndex) =>
    question.field_name || String(questionIndex);

  const getQuestionOptions = (question) => {
    if (question.options?.length > 0) return question.options;
    if (question.expected_answer_type === "yes_no") return ["예", "아니오"];
    return [];
  };

  const hasAllClarificationAnswers = (msg, answers) =>
    msg.questions.every((item, index) => {
      const key = getQuestionKey(null, item, index);
      return !!answers[key]?.trim();
    });

  const buildAnswerSummary = (msg, answers) =>
    msg.questions
      .map((question, questionIndex) => {
        const key = getQuestionKey(null, question, questionIndex);
        return `${question.question}: ${answers[key]}`;
      })
      .join("\n");

  const sendClarificationAnswers = async (messageIndex, msg, answers) => {
    if (!msg.sessionId) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "추가질문 세션이 없어 다시 질문을 보내주세요.",
        },
      ]);
      return;
    }

    setSubmittedQuestionMessages((prev) => ({
      ...prev,
      [messageIndex]: true,
    }));
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: buildAnswerSummary(msg, answers) },
    ]);
    setLoading(true);

    try {
      const res = await fetch(CLARIFY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: msg.sessionId,
          answers,
        }),
      });

      if (!res.ok) {
        throw new Error(`Clarify API error: ${res.status}`);
      }

      const botData = await res.json();

      console.log("추가질문 응답:", botData);

      setMessages((prev) => [
        ...prev,
        buildBotMessage(botData, "조건에 맞는 정책을 정리했어요."),
      ]);
    } catch (e) {
      console.log("추가질문 오류:", e.message);

      setSubmittedQuestionMessages((prev) => ({
        ...prev,
        [messageIndex]: false,
      }));
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "추가질문 답변 전송 중 서버 오류가 발생했어요 😢",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuestionAnswer = (
    messageIndex,
    question,
    questionIndex,
    answer,
  ) => {
    const questionKey = getQuestionKey(null, question, questionIndex);

    setSelectedQuestionAnswers((prev) => ({
      ...prev,
      [messageIndex]: {
        ...(prev[messageIndex] || {}),
        [questionKey]: answer,
      },
    }));
  };

  const submitClarificationAnswers = (messageIndex, msg) => {
    if (loading || submittedQuestionMessages[messageIndex]) return;

    const answers = selectedQuestionAnswers[messageIndex] || {};
    if (!hasAllClarificationAnswers(msg, answers)) return;

    sendClarificationAnswers(messageIndex, msg, answers);
  };

  const selectQuestionOption = (
    messageIndex,
    question,
    questionIndex,
    option,
  ) => {
    if (loading || submittedQuestionMessages[messageIndex]) return;
    updateQuestionAnswer(messageIndex, question, questionIndex, option);
  };

  const shouldShowMessageBubble = (msg) =>
    !(msg.sender === "bot" && msg.questions?.length > 0);

  const shouldShowFollowUp = () => false;

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          height: 70,
          paddingHorizontal: 20,
          paddingTop: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#e5e7eb",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
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

        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 22,
            fontWeight: "900",
            marginRight: 28,
          }}
        >
          靑定
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1, backgroundColor: "#f8fafc" }}
        contentContainerStyle={{ padding: 18, paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((msg, index) => (
          <View key={index} style={{ marginBottom: 14 }}>
            {shouldShowMessageBubble(msg) && (
              <View
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor:
                    msg.sender === "user" ? "#2563eb" : "#ffffff",
                  borderWidth: msg.sender === "bot" ? 1 : 0,
                  borderColor: "#e5e7eb",
                  paddingVertical: 13,
                  paddingHorizontal: 15,
                  borderRadius: 18,
                  maxWidth: msg.regionForm && !residenceRegion ? "95%" : "85%",
                }}
              >
                <Text
                  style={{
                    color: msg.sender === "user" ? "white" : "#111827",
                    lineHeight: 22,
                    fontSize: 15,
                  }}
                >
                  {String(msg.text)}
                </Text>

                {msg.regionForm && !residenceRegion && (
                  <View style={{ marginTop: 14 }}>
                    <TextInput
                      value={sidoInput}
                      onChangeText={(text) => {
                        setSidoInput(text);
                        setActiveRegionField("sido");
                      }}
                      onFocus={() => setActiveRegionField("sido")}
                      placeholder="시/도 입력"
                      placeholderTextColor="#9ca3af"
                      style={regionInput}
                    />

                    {sidoSuggestions.length > 0 && (
                      <SuggestionRow
                        suggestions={sidoSuggestions}
                        onPress={(sido) => {
                          setSidoInput(sido);
                          setActiveRegionField(null);
                          if (
                            !regionData[sido]?.includes(districtInput.trim())
                          ) {
                            setDistrictInput("");
                          }
                        }}
                      />
                    )}

                    <TextInput
                      value={districtInput}
                      onChangeText={(text) => {
                        setDistrictInput(text);
                        setActiveRegionField("district");
                      }}
                      onFocus={() => setActiveRegionField("district")}
                      placeholder="구/시/군 입력"
                      placeholderTextColor="#9ca3af"
                      style={regionInput}
                    />

                    {districtSuggestions.length > 0 && (
                      <SuggestionRow
                        suggestions={districtSuggestions}
                        onPress={(district) => {
                          setDistrictInput(district);
                          setActiveRegionField(null);
                        }}
                      />
                    )}

                    <TouchableOpacity
                      onPress={saveResidenceRegion}
                      disabled={!sidoInput.trim() || !districtInput.trim()}
                      style={{
                        height: 46,
                        borderRadius: 14,
                        backgroundColor:
                          sidoInput.trim() && districtInput.trim()
                            ? "#2563eb"
                            : "#cbd5e1",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: "white", fontWeight: "900" }}>
                        확인
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

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
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#eff6ff",
                        padding: 14,
                      }}
                    >
                      <Text
                        style={{
                          color: "#2563eb",
                          fontSize: 16,
                          fontWeight: "900",
                        }}
                      >
                        💡 {policy.title || policy.name || "정책명 없음"}
                      </Text>
                    </View>

                    <View style={{ padding: 14 }}>
                      <Text style={cardLabel}>지원 대상</Text>
                      <Text style={cardText}>
                        {policy.region ||
                          policy.target ||
                          "정확한 확인이 필요합니다."}
                      </Text>

                      <Text style={cardLabel}>지원 내용</Text>
                      <Text style={cardText}>
                        {policy.amount ||
                          policy.content ||
                          policy.description ||
                          "정확한 확인이 필요합니다."}
                      </Text>

                      <Text style={cardLabel}>신청 기간</Text>
                      <Text style={cardText}>
                        {policy.deadline || "상시 또는 확인 필요"}
                      </Text>

                      {!!policy.reason && (
                        <>
                          <Text style={cardLabel}>추천 이유</Text>
                          <Text style={cardText}>{policy.reason}</Text>
                        </>
                      )}

                      <TouchableOpacity
                        style={{
                          marginTop: 10,
                          height: 46,
                          borderRadius: 12,
                          backgroundColor: "#2563eb",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontWeight: "800",
                          }}
                        >
                          상세 내용 확인하기 〉
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {shouldShowFollowUp(msg) && (
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
                      backgroundColor: "#eff6ff",
                    }}
                  >
                    <Text
                      style={{
                        color: "#2563eb",
                        fontWeight: "800",
                        fontSize: 15,
                      }}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {msg.questions?.length > 0 && (
              <View style={{ marginTop: 10 }}>
                {msg.questions.map((question, i) => {
                  const questionKey = getQuestionKey(null, question, i);
                  const questionOptions = getQuestionOptions(question);
                  const selectedAnswer =
                    selectedQuestionAnswers[index]?.[questionKey] || "";

                  return (
                    <View
                      key={question.field_name || i}
                      style={{
                        backgroundColor: "white",
                        borderRadius: 16,
                        marginTop: 10,
                        borderWidth: 1,
                        borderColor: "#e5e7eb",
                        padding: 14,
                      }}
                    >
                      <Text
                        style={{
                          color: "#111827",
                          fontSize: 15,
                          lineHeight: 22,
                          fontWeight: "900",
                        }}
                      >
                        {question.question}
                      </Text>

                      {!!question.reason && (
                        <Text
                          style={{
                            color: "#64748b",
                            fontSize: 13,
                            lineHeight: 19,
                            marginTop: 6,
                          }}
                        >
                          {question.reason}
                        </Text>
                      )}

                      {questionOptions.length > 0 ? (
                        <View style={{ marginTop: 10 }}>
                          {questionOptions.map((option, optionIndex) => (
                            <TouchableOpacity
                              key={`${question.field_name || i}-${option}`}
                              onPress={() =>
                                selectQuestionOption(index, question, i, option)
                              }
                              disabled={
                                loading || submittedQuestionMessages[index]
                              }
                              style={{
                                marginTop: optionIndex === 0 ? 0 : 8,
                                borderWidth: 1,
                                borderColor:
                                  selectedAnswer === option
                                    ? "#2563eb"
                                    : "#bfdbfe",
                                borderRadius: 14,
                                paddingVertical: 12,
                                paddingHorizontal: 13,
                                backgroundColor:
                                  selectedAnswer === option
                                    ? "#dbeafe"
                                    : "#eff6ff",
                              }}
                            >
                              <Text
                                style={{
                                  color: "#2563eb",
                                  fontWeight: "800",
                                  fontSize: 14,
                                  lineHeight: 20,
                                }}
                              >
                                {option}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      ) : (
                        <TextInput
                          value={selectedAnswer}
                          onChangeText={(text) =>
                            updateQuestionAnswer(index, question, i, text)
                          }
                          editable={
                            !loading && !submittedQuestionMessages[index]
                          }
                          placeholder="답변을 입력해주세요"
                          placeholderTextColor="#94a3b8"
                          style={clarificationInput}
                        />
                      )}
                    </View>
                  );
                })}

                <TouchableOpacity
                  onPress={() => submitClarificationAnswers(index, msg)}
                  disabled={
                    loading ||
                    submittedQuestionMessages[index] ||
                    !hasAllClarificationAnswers(
                      msg,
                      selectedQuestionAnswers[index] || {},
                    )
                  }
                  style={{
                    marginTop: 10,
                    height: 46,
                    borderRadius: 14,
                    backgroundColor:
                      loading ||
                      submittedQuestionMessages[index] ||
                      !hasAllClarificationAnswers(
                        msg,
                        selectedQuestionAnswers[index] || {},
                      )
                        ? "#cbd5e1"
                        : "#2563eb",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "900",
                      fontSize: 14,
                    }}
                  >
                    답변 제출
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {loading && (
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: "#e5e7eb",
              paddingVertical: 13,
              paddingHorizontal: 15,
              borderRadius: 18,
              marginBottom: 12,
              maxWidth: "85%",
            }}
          >
            <Text
              style={{
                color: "#64748b",
                lineHeight: 22,
                fontSize: 15,
              }}
            >
              정책 정보를 찾고 있어요... 🔎
            </Text>
          </View>
        )}
      </ScrollView>

      <View
        style={{
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#f8fafc",
            borderRadius: 24,
            paddingHorizontal: 16,
            height: 54,
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={
              !residenceRegion
                ? "거주 지역을 먼저 입력해주세요"
                : loading
                  ? "답변 생성 중..."
                  : "메시지를 입력하세요"
            }
            placeholderTextColor="#9ca3af"
            editable={!!residenceRegion && !loading}
            style={{
              flex: 1,
              color: residenceRegion ? "#111" : "#94a3b8",
              fontSize: 15,
              outlineStyle: "none",
            }}
          />

          <TouchableOpacity
            onPress={() => sendMessage()}
            disabled={!residenceRegion || loading}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor:
                !residenceRegion || loading ? "#cbd5e1" : "#2563eb",
              justifyContent: "center",
              alignItems: "center",
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

function SuggestionRow({ suggestions, onPress }) {
  return (
    <ScrollView horizontal style={{ marginTop: 8, marginBottom: 10 }}>
      {suggestions.map((item, index) => (
        <TouchableOpacity
          key={`${item}-${index}`}
          onPress={() => onPress(item)}
          style={{
            marginRight: 8,
            paddingHorizontal: 13,
            paddingVertical: 8,
            backgroundColor: "#eff6ff",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#bfdbfe",
          }}
        >
          <Text style={{ color: "#2563eb", fontWeight: "800" }}>{item}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const regionInput = {
  height: 48,
  backgroundColor: "#f8fafc",
  borderWidth: 1,
  borderColor: "#e5e7eb",
  borderRadius: 16,
  paddingHorizontal: 14,
  color: "#111",
  fontSize: 15,
  marginBottom: 10,
  outlineStyle: "none",
};

const clarificationInput = {
  height: 48,
  backgroundColor: "#f8fafc",
  borderWidth: 1,
  borderColor: "#bfdbfe",
  borderRadius: 14,
  paddingHorizontal: 13,
  color: "#111827",
  fontSize: 14,
  marginTop: 10,
  outlineStyle: "none",
};

const cardLabel = {
  color: "#64748b",
  fontSize: 12,
  fontWeight: "700",
  marginTop: 8,
  marginBottom: 4,
};

const cardText = {
  color: "#111827",
  fontSize: 14,
  lineHeight: 21,
  marginBottom: 6,
};
