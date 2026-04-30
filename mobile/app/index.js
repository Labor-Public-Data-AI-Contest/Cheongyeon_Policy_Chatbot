import { ScrollView, View, TextInput, TouchableOpacity, Text } from "react-native";
import Header from "../components/Header";
import PolicyCard from "../components/PolicyCard";
import Category from "../components/Category";

export default function App() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>

      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 22, paddingTop: 50 }}>

          <Header />

          <View style={{
            marginTop: 28,
            backgroundColor: "white",
            borderRadius: 22,
            paddingHorizontal: 18,
            height: 50,
            justifyContent: "center"
          }}>
            <TextInput placeholder="관심있는 정책을 검색해보세요." />
          </View>

          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 16
          }}>
            <Text style={{ fontSize: 20, fontWeight: "900", lineHeight: 28 }}>
              현재 조회수가{"\n"}
              <Text style={{ color: "#2563eb" }}>가장 높은 정책</Text>이에요! 🔥
            </Text>

            <Text style={{ color: "#2563eb", fontWeight: "700" }}>
              전체보기
            </Text>
          </View>

          <View style={{ marginTop: 12 }}>
            <PolicyCard
              title="청년내일채움공제 2024년 신규 가입자 모집"
              desc="중소기업 정규직 취업 청년의 장기 근속과 자산형성을 지원합니다."
              tag1="취업지원"
              tag2="D-15"
              views="12,405"
              active
            />
          </View>

          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 38
          }}>
            <Category icon="💼" title="일자리" />
            <Category icon="🏠" title="주거" />
            <Category icon="🎓" title="교육" />
            <Category icon="🧡" title="복지/문화" />
          </View>

        </View>
      </ScrollView>

      <TouchableOpacity
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
        }}
      >
        <Text style={{ fontSize: 26, color: "white" }}>💬</Text>
      </TouchableOpacity>

    </View>
  );
}