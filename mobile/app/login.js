import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import api from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [autoLogin, setAutoLogin] = useState(true);
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!userid.trim()) {
      alert("아이디를 입력해주세요.");
      return;
    }

    if (!password.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await api.post("/api/auth/login", {
        userid: userid,
        userpassword: password,
      });

      console.log("로그인 성공:", res.data);

      await AsyncStorage.setItem("token", String(res.data.token));
      await AsyncStorage.setItem("userid", String(res.data.userid));
      await AsyncStorage.setItem("name", String(res.data.name));

      router.replace("/");
    } catch (e) {
      console.log("로그인 에러 전체:", e);
      console.log("로그인 에러 메시지:", e.message);
      console.log("서버 응답:", e.response?.data);

      alert(e.response?.data || e.message || "로그인 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 24, paddingTop: 55 }}>

      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 32 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 28 }}>‹</Text>
        </TouchableOpacity>

        <Text style={{
          flex: 1,
          textAlign: "center",
          fontSize: 18,
          fontWeight: "800",
          marginRight: 28
        }}>
          로그인
        </Text>
      </View>

      <Text style={{ fontSize: 24, fontWeight: "900", marginBottom: 8 }}>
        만나서 반가워요! 😊
      </Text>

      <Text style={{ color: "#64748b", lineHeight: 21, marginBottom: 32 }}>
        청년플랫폼의 다양한 정책 정보를{"\n"}
        지금 바로 확인해보세요.
      </Text>

      <Text style={{ fontWeight: "700", marginBottom: 8 }}>
        아이디
      </Text>

      <TextInput
        placeholder="아이디를 입력해주세요"
        placeholderTextColor="#9ca3af"
        value={userid}
        onChangeText={setUserid}
        style={inputStyle}
      />

      <Text style={{ fontWeight: "700", marginBottom: 8 }}>
        비밀번호
      </Text>

      <TextInput
        placeholder="비밀번호를 입력해주세요"
        placeholderTextColor="#9ca3af"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[inputStyle, { marginBottom: 18 }]}
      />

      <TouchableOpacity
        onPress={() => setAutoLogin(!autoLogin)}
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 28 }}
      >
        <View style={{
          width: 18,
          height: 18,
          borderRadius: 4,
          backgroundColor: autoLogin ? "#2563eb" : "white",
          borderWidth: 1,
          borderColor: autoLogin ? "#2563eb" : "#cbd5e1",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 8
        }}>
          {autoLogin && <Text style={{ color: "white", fontSize: 12 }}>✓</Text>}
        </View>

        <Text style={{ color: "#475569" }}>자동 로그인</Text>
      </TouchableOpacity>

      <View style={{
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 40
      }}>
        <Text style={{ color: "#64748b" }}>아이디 찾기</Text>
        <Text style={{ color: "#cbd5e1", marginHorizontal: 12 }}>|</Text>
        <Text style={{ color: "#64748b" }}>비밀번호 찾기</Text>
        <Text style={{ color: "#cbd5e1", marginHorizontal: 12 }}>|</Text>

        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={{ fontWeight: "800" }}>회원가입</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }} />

      <TouchableOpacity
        onPress={handleLogin}
        style={{
          height: 56,
          borderRadius: 14,
          backgroundColor: "#2563eb",
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#2563eb",
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 5
        }}
      >
        <Text style={{ color: "white", fontSize: 18, fontWeight: "800" }}>
          로그인
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const inputStyle = {
  height: 54,
  borderRadius: 12,
  backgroundColor: "#f8fafc",
  borderWidth: 1,
  borderColor: "#e5e7eb",
  paddingHorizontal: 16,
  marginBottom: 22,
  color: "#111",
};