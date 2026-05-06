import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.log("알림 목록 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const handleNotificationPress = async (notification) => {
    const token = await AsyncStorage.getItem("token");

    // 로그인한 사용자만 읽음 처리
    if (token && !notification.readStatus) {
      try {
        await api.patch(`/api/notifications/${notification.id}/read`);

        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notification.id
              ? { ...item, readStatus: true }
              : item
          )
        );
      } catch (error) {
        console.log("알림 읽음 처리 실패:", error);
      }
    }

    // 정책 상세 이동
    if (notification.policyId) {
      router.push(`/policy-detail?id=${notification.policyId}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/");
            }
          }}
        >
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>알림</Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>아직 알림이 없습니다.</Text>
          </View>
        ) : (
          notifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card,
                item.readStatus ? styles.readCard : styles.unreadCard,
              ]}
              onPress={() => handleNotificationPress(item)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {!item.readStatus && <View style={styles.dot} />}
              </View>

              <Text style={styles.message}>{item.message}</Text>

              <Text style={styles.date}>
                {item.createdAt
                  ? item.createdAt.replace("T", " ").slice(0, 16)
                  : ""}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 18,
    paddingTop: 50,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  back: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
  },
  emptyBox: {
    marginTop: 80,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#64748b",
    fontWeight: "600",
  },
  card: {
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
  },
  unreadCard: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
  },
  readCard: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
    flex: 1,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#ef4444",
    marginLeft: 8,
  },
  message: {
    marginTop: 8,
    fontSize: 14,
    color: "#334155",
    lineHeight: 20,
  },
  date: {
    marginTop: 10,
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
  },
};