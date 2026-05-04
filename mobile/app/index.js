import { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import Header from "../components/Header";
import PolicyCard from "../components/PolicyCard";
import Category from "../components/Category";
import { router } from "expo-router";
import api from "../api/api";

const screenWidth = Dimensions.get("window").width;

export default function App() {
  const [policies, setPolicies] = useState([]);
  const [unemployedPolicies, setUnemployedPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unemployedLoading, setUnemployedLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  const scrollRef = useRef(null);
  const currentIndex = useRef(0);

  useEffect(() => {
    fetchPolicies();
    fetchUnemployedPolicies();
  }, []);

  useEffect(() => {
    if (policies.length === 0) return;

    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % policies.length;

      scrollRef.current?.scrollTo({
        x: currentIndex.current * (screenWidth - 44),
        animated: true,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [policies]);

  const fetchPolicies = async () => {
    try {
      const res = await api.get("/api/policies/random");
      setPolicies(res.data);
    } catch (error) {
      console.log("랜덤 정책 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnemployedPolicies = async () => {
    try {
      const res = await api.get("/api/policies/recommend");

      setUnemployedPolicies(res.data);
    } catch (error) {
      console.log("추천 정책 불러오기 실패:", error);
    } finally {
      setUnemployedLoading(false);
    }
  };


  const handleSearch = () => {
    if (!keyword.trim()) return;
    router.push(`/policies?keyword=${encodeURIComponent(keyword.trim())}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 22, paddingTop: 50 }}>
          <Header />

          <View
            style={{
              marginTop: 22,
              backgroundColor: "white",
              borderRadius: 22,
              height: 50,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 18, marginRight: 8, color: "#94a3b8" }}>
              🔍
            </Text>

            <TextInput
              placeholder="관심있는 정책을 검색해보세요."
              placeholderTextColor="#94a3b8"
              value={keyword}
              onChangeText={setKeyword}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
              style={{
                flex: 1,
                fontSize: 14,
                color: "#111827",
              }}
            />

            <TouchableOpacity onPress={handleSearch}>
              <Text style={{ color: "#2563eb", fontWeight: "800" }}>
                검색
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginTop: 28,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "900", lineHeight: 28 }}>
              추천 정책을{"\n"}
              <Text style={{ color: "#2563eb" }}>랜덤으로 보여드려요!</Text> 🔥
            </Text>

            <TouchableOpacity onPress={() => router.push("/policies")}>
              <Text style={{ color: "#2563eb", fontWeight: "700" }}>
                전체보기
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 12 }}>
            {loading ? (
              <ActivityIndicator size="large" />
            ) : (
              <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
              >
                {policies.map((policy, index) => (
                  <View key={policy.id} style={{ width: screenWidth - 44 }}>
                    <PolicyCard
                      title={policy.title}
                      desc={policy.desc}
                      tag1={policy.category}
                      tag2={policy.region}
                      views={policy.views?.toLocaleString() ?? "0"}
                      active={index === 0}
                      fixedHeight
                      onPress={() => router.push(`/policy-detail?id=${policy.id}`)}
                    />
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 38,
            }}
          >
            <Category icon="💼" title="일자리" />
            <Category icon="🏠" title="주거" />
            <Category icon="🎓" title="교육" />
            <Category icon="🧡" title="복지/문화" />
          </View>

          <View style={{ marginTop: 42 }}>
            <Text style={{ fontSize: 20, fontWeight: "900", lineHeight: 28 }}>
              <Text style={{ color: "#2563eb" }}>미취업자</Text>들을 위한{"\n"}
              맞춤 정책이에요! 🎯
            </Text>

            <View style={{ marginTop: 14 }}>
              {unemployedLoading ? (
                <ActivityIndicator size="large" />
              ) : unemployedPolicies.length === 0 ? (
                <Text style={{ color: "#64748b", fontWeight: "600" }}>
                  추천 정책이 없습니다.
                </Text>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  {unemployedPolicies.map((policy, index) => (
                    <View
                      key={policy.id}
                      style={{
                        width: screenWidth * 0.72,
                        marginRight: 14,
                      }}
                    >
                      <PolicyCard
                        title={policy.title}
                        desc={policy.desc}
                        tag1={policy.category}
                        tag2={policy.region}
                        views={policy.views?.toLocaleString() ?? "0"}
                        active={index === 0}
                        fixedHeight
                        onPress={() =>
                          router.push(`/policy-detail?id=${policy.id}`)
                        }
                      />
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => router.push("/chat")}
        style={{
          position: "absolute",
          right: 24,
          bottom: 45,
          width: 58,
          height: 58,
          borderRadius: 29,
          backgroundColor: "#4f46e5",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#4f46e5",
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 6,
        }}
      >
        <Text style={{ fontSize: 26, color: "white" }}>💬</Text>
      </TouchableOpacity>
    </View>
  );
}