import { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";

export default function Header() {
  const [isLogin, setIsLogin] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const checkLogin = async () => {
    const token = await AsyncStorage.getItem("token");
    setIsLogin(!!token);

    fetchUnreadCount();
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("/api/notifications/unread-count");
      setUnreadCount(res.data);
    } catch (error) {
      console.log("알림 개수 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  useFocusEffect(
    useCallback(() => {
      checkLogin();
    }, [])
  );

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: "#2563eb",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "400",
              fontSize: 22,
              lineHeight: 20,
              textAlign: "center",
            }}
          >
            靑
          </Text>
        </View>

        <Text style={{ fontSize: 22, fontWeight: "800" }}>청정</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <TouchableOpacity
          onPress={() => router.push("/notifications")}
          style={{ position: "relative", padding: 4 }}
        >
          <Text style={{ fontSize: 20 }}>🔔</Text>

          {unreadCount > 0 && (
            <View
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: "red",
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 4
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 11,
                  fontWeight: "800"
                }}
              >
                {unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {isLogin ? (
          <TouchableOpacity
            style={{ paddingHorizontal: 6 }}
            onPress={() => router.push("/mypage")}
          >
            <Text style={{ color: "#2563eb", fontWeight: "700", fontSize: 15 }}>
              마이페이지
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ paddingHorizontal: 6 }}
            onPress={() => router.push("/login")}
          >
            <Text style={{ color: "#2563eb", fontWeight: "700", fontSize: 15 }}>
              로그인
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}