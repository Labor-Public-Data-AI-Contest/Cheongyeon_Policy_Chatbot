import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { useToast } from "../context/ToastContext";

export default function MyPage() {
    const [user, setUser] = useState(null);
    const { showToast } = useToast();
    const [favoritePolicies, setFavoritePolicies] = useState([]);
    const [favoriteLoading, setFavoriteLoading] = useState(true);

    const getFavoritePolicies = async () => {
        try {
            const res = await api.get("/api/favorites/me");
            setFavoritePolicies(res.data);
        } catch (e) {
            console.log("찜한 정책 조회 실패:", e.response?.data || e.message);
        } finally {
            setFavoriteLoading(false);
        }
    };



    const getMyInfo = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            if (!token) {
                showToast("로그인이 필요합니다.", "error");
                router.replace("/login");
                return;
            }

            const res = await api.get("/api/user/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser(res.data);
        } catch (e) {
            console.log("내 정보 조회 실패:", e.response?.data || e.message);
            showToast("내 정보를 불러오지 못했어요", "error");
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("userid");
        await AsyncStorage.removeItem("name");

        showToast("로그아웃 되었어요");

        setTimeout(() => {
            router.replace("/");
        }, 700);
    };

    useEffect(() => {
        getMyInfo();
        getFavoritePolicies();

    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
            <ScrollView style={{ flex: 1 }}>
                {/* 상단 카드 */}
                <View style={{ backgroundColor: "white", padding: 24, paddingTop: 55 }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 30
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
                            <Text style={{ fontSize: 26 }}>‹</Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 24, fontWeight: "900", color: "#111827" }}>
                            마이페이지
                        </Text>

                        <TouchableOpacity>
                            <Text style={{ fontSize: 24 }}>🔔</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 사용자 정보 */}
                    <View style={{ marginBottom: 18 }}>
                        <View style={{ flexDirection: "row", alignItems: "flex-end", marginBottom: 10 }}>
                            <Text style={{ fontSize: 26, fontWeight: "900", color: "#111827" }}>
                                {user?.name || "사용자"}님
                            </Text>

                            <Text style={{
                                color: "#3b82f6",
                                fontWeight: "700",
                                marginLeft: 10,
                                marginBottom: 3
                            }}>
                                반가워요!
                            </Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
                            <Text style={{ color: "#64748b", fontSize: 15 }}>
                                📍 {user?.address || "주소 정보 없음"}
                            </Text>

                            <Text style={{ color: "#cbd5e1", marginHorizontal: 14 }}>|</Text>

                            <Text style={{ color: "#64748b", fontSize: 15 }}>
                                {user?.age ? `${user.age}세` : "나이 정보 없음"}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => router.push("/profile-edit")}
                            style={{
                                alignSelf: "flex-start",
                                backgroundColor: "#f1f5f9",
                                paddingHorizontal: 18,
                                paddingVertical: 8,
                                borderRadius: 18
                            }}
                        >
                            <Text style={{ color: "#64748b", fontWeight: "700" }}>
                                프로필 수정
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 찜한 정책 */}
                <View style={{ padding: 24 }}>
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 18
                    }}>
                        <Text style={{ fontSize: 22, fontWeight: "900", color: "#111827" }}>
                            내가 찜한 정책
                        </Text>

                        <TouchableOpacity onPress={() => router.push("/favorites")}>
                            <Text style={{ color: "#94a3b8", fontWeight: "700" }}>
                                전체보기
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {favoriteLoading ? (
                        <ActivityIndicator size="large" />
                    ) : favoritePolicies.length === 0 ? (
                        <Text style={{ color: "#64748b", fontWeight: "700" }}>
                            찜한 정책이 없습니다.
                        </Text>
                    ) : (
                        favoritePolicies.slice(0, 5).map((policy) => (
                            <TouchableOpacity
                                key={policy.id}
                                onPress={() => router.push(`/policy-detail?id=${policy.id}`)}
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: 18,
                                    padding: 18,
                                    marginBottom: 16,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    shadowColor: "#000",
                                    shadowOpacity: 0.05,
                                    shadowRadius: 8,
                                    elevation: 2,
                                    borderWidth: 1,
                                    borderColor: "#e5e7eb"
                                }}
                            >
                                <View style={{
                                    width: 54,
                                    height: 54,
                                    borderRadius: 14,
                                    backgroundColor: "#eff6ff",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: 16
                                }}>
                                    <Text style={{ fontSize: 24 }}>🔖</Text>
                                </View>

                                <View style={{ flex: 1 }}>
                                    <View style={{
                                        alignSelf: "flex-start",
                                        backgroundColor: "#dbeafe",
                                        paddingHorizontal: 10,
                                        paddingVertical: 4,
                                        borderRadius: 8,
                                        marginBottom: 6
                                    }}>
                                        <Text style={{
                                            color: "#2563eb",
                                            fontSize: 12,
                                            fontWeight: "800"
                                        }}>
                                            {policy.keywords || "정책"}
                                        </Text>
                                    </View>

                                    <Text style={{
                                        fontSize: 17,
                                        fontWeight: "900",
                                        color: "#111827",
                                        marginBottom: 5
                                    }}>
                                        {policy.title}
                                    </Text>

                                    <Text numberOfLines={2} style={{ color: "#64748b", lineHeight: 20 }}>
                                        {policy.desc || policy.description || "설명 정보가 없습니다."}
                                    </Text>
                                </View>

                                <Text style={{ color: "#3b82f6", fontSize: 24, marginLeft: 8 }}>
                                    ❤️
                                </Text>
                            </TouchableOpacity>
                        ))
                    )}

                    {/* 로그아웃 버튼 */}
                    <TouchableOpacity
                        onPress={logout}
                        style={{
                            marginTop: 30,
                            height: 52,
                            borderRadius: 14,
                            borderWidth: 1,
                            borderColor: "#fee2e2",
                            backgroundColor: "#fef2f2",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Text style={{
                            color: "#ef4444",
                            fontSize: 16,
                            fontWeight: "800"
                        }}>
                            로그아웃
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}