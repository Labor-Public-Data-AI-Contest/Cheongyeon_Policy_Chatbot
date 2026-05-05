import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import api from "../api/api";
import PolicyCard from "../components/PolicyCard";

export default function Favorites() {
  const [favoritePolicies, setFavoritePolicies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await api.get("/api/favorites/me");

      setFavoritePolicies(res.data);
      setFavorites(res.data.map((p) => p.id));
    } catch (error) {
      console.log("찜한 정책 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (policyId) => {
    setFavorites((prev) =>
      prev.includes(policyId)
        ? prev.filter((id) => id !== policyId)
        : [...prev, policyId]
    );

    setFavoritePolicies((prev) =>
      prev.filter((policy) => policy.id !== policyId)
    );

    try {
      await api.post(`/api/favorites/${policyId}`);
    } catch (error) {
      console.log("찜 취소 실패:", error);
      fetchFavorites();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <View
        style={{
          paddingTop: 55,
          paddingHorizontal: 22,
          paddingBottom: 18,
          backgroundColor: "white",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 26 }}>‹</Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 20, fontWeight: "900" }}>
          찜한 정책 전체보기
        </Text>

        <View style={{ width: 26 }} />
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={favoritePolicies}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{
            padding: 22,
            paddingBottom: 40,
          }}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 14 }}>
              <PolicyCard
                title={item.title}
                desc={item.desc || item.description}
                tag1={item.keywords}
                tag2={item.region}
                views={item.views?.toLocaleString() ?? "0"}
                favoriteButton
                favorite={favorites.includes(item.id)}
                onFavoritePress={() => toggleFavorite(item.id)}
                onPress={() => router.push(`/policy-detail?id=${item.id}`)}
              />
            </View>
          )}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                marginTop: 50,
                color: "#94a3b8",
                fontWeight: "700",
              }}
            >
              찜한 정책이 없습니다.
            </Text>
          }
        />
      )}
    </View>
  );
}