import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { useToast } from "../context/ToastContext";

export default function MyPage() {
    const [user, setUser] = useState(null);
    const { showToast } = useToast();

    const favoritePolicies = [
        {
            title: "청년도약계좌",
            category: "금융지원",
            desc: "5년 만기 시 최대 5,000만원 목돈 마련 지원",
            icon: "💳",
            color: "#eff6ff",
            tagColor: "#dbeafe",
            textColor: "#2563eb",
        },
        {
            title: "청년 월세 특별지원",
            category: "주거복지",
            desc: "월 최대 20만원, 최장 12개월간 월세 지원",
            icon: "🏠",
            color: "#fff7ed",
            tagColor: "#ffedd5",
            textColor: "#f97316",
        },
        {
            title: "서울 영테크 자산형성",
            category: "취업지원",
            desc: "청년 맞춤형 재무 상담 및 교육 제공",
            icon: "💼",
            color: "#ecfdf5",
            tagColor: "#dcfce7",
            textColor: "#22c55e",
        },
    ];

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

                        <TouchableOpacity>
                            <Text style={{ color: "#94a3b8", fontWeight: "700" }}>
                                전체보기
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {favoritePolicies.map((policy, index) => (
                        <View
                            key={index}
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
                                backgroundColor: policy.color,
                                justifyContent: "center",
                                alignItems: "center",
                                marginRight: 16
                            }}>
                                <Text style={{ fontSize: 24 }}>{policy.icon}</Text>
                            </View>

                            <View style={{ flex: 1 }}>
                                <View style={{
                                    alignSelf: "flex-start",
                                    backgroundColor: policy.tagColor,
                                    paddingHorizontal: 10,
                                    paddingVertical: 4,
                                    borderRadius: 8,
                                    marginBottom: 6
                                }}>
                                    <Text style={{
                                        color: policy.textColor,
                                        fontSize: 12,
                                        fontWeight: "800"
                                    }}>
                                        {policy.category}
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

                                <Text style={{ color: "#64748b", lineHeight: 20 }}>
                                    {policy.desc}
                                </Text>
                            </View>

                            <Text style={{ color: "#3b82f6", fontSize: 24, marginLeft: 8 }}>
                                🔖
                            </Text>
                        </View>
                    ))}

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