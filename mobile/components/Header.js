import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback } from "react";

export default function Header() {
  const [isLogin, setIsLogin] = useState(false);

  const checkLogin = async () => {
    const token = await AsyncStorage.getItem("token");
    setIsLogin(!!token);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkLogin();
    }, [])
  );

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setIsLogin(false);
    alert("로그아웃 완료");
    router.replace("/");
  };

  return (
    <View style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View style={{
          width: 34,
          height: 34,
          borderRadius: 17,
          backgroundColor: "#2563eb",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Y</Text>
        </View>

        <Text style={{ fontSize: 18, fontWeight: "800" }}>
          청년플랫폼
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 5 }}>
        <Text style={{ fontSize: 20, marginRight: 14 }}>🔔</Text>

        {isLogin ? (
          <TouchableOpacity
            style={{ paddingHorizontal: 6 }}
            onPress={logout}
          >
            <Text style={{
              color: "#2563eb" ,
              fontWeight: "700",
              fontSize: 15
            }}>
              로그아웃
            </Text>
          </TouchableOpacity>
        ) : (
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
        )}
      </View>
    </View>
  );
}