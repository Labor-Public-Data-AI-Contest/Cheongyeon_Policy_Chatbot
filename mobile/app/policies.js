import { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";
import api from "../api/api";
import PolicyCard from "../components/PolicyCard";

export default function Policies() {
    const { keyword } = useLocalSearchParams();

    const [searchText, setSearchText] = useState(keyword ?? "");
    const [policies, setPolicies] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [last, setLast] = useState(false);

    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
        };
    }, []);

    useEffect(() => {
        setSearchText(keyword ?? "");
        setPolicies([]);
        setPage(0);
        setLast(false);
        fetchPolicies(0, true, keyword);
    }, [keyword]);

    const fetchPolicies = async (
        pageNumber,
        reset = false,
        searchKeyword = keyword
    ) => {
        if (loading || (!reset && last)) return;

        setLoading(true);

        try {
            const cleanKeyword =
                typeof searchKeyword === "string" ? searchKeyword.trim() : "";

            const url = cleanKeyword
                ? `/api/policies/search?keyword=${encodeURIComponent(
                    cleanKeyword
                )}&page=${pageNumber}&size=10`
                : `/api/policies?page=${pageNumber}&size=10`;

            const res = await api.get(url);

            if (!mountedRef.current) return;

            const newData = res.data.content || [];

            setPolicies((prev) => (reset ? newData : [...prev, ...newData]));
            setPage(pageNumber);
            setLast(res.data.last);
        } catch (error) {
            if (mountedRef.current) {
                console.log("정책 목록 불러오기 실패:", error);
            }
        } finally {
            if (mountedRef.current) {
                setLoading(false);
            }
        }
    };

    const handleSearch = () => {
        const cleanKeyword = searchText.trim();

        if (!cleanKeyword) {
            router.replace("/policies");
            return;
        }

        router.replace(
            `/policies?keyword=${encodeURIComponent(cleanKeyword)}`
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
            <View
                style={{
                    paddingTop: 55,
                    paddingBottom: 16,
                    paddingHorizontal: 22,
                    backgroundColor: "#f8fafc",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 18,
                    }}
                >
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={{ fontSize: 22 }}>‹</Text>
                    </TouchableOpacity>

                    <Text style={{ fontSize: 20, fontWeight: "900" }}>
                        {keyword ? "검색 결과" : "전체 정책"}
                    </Text>

                    <View style={{ width: 22 }} />
                </View>

                <View
                    style={{
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
                        value={searchText}
                        onChangeText={setSearchText}
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

                {keyword && (
                    <Text
                        style={{
                            marginTop: 14,
                            color: "#64748b",
                            fontWeight: "600",
                        }}
                    >
                        "{keyword}" 검색 결과
                    </Text>
                )}
            </View>

            <FlatList
                data={policies}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={{
                    paddingHorizontal: 22,
                    paddingBottom: 40,
                }}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 14 }}>
                        <PolicyCard
                            title={item.title}
                            desc={item.desc}
                            tag1={item.category}
                            tag2={item.region}
                            views={item.views?.toLocaleString() ?? "0"}
                            onPress={() => router.push(`/policy-detail?id=${item.id}`)}
                        />
                    </View>
                )}
                onEndReached={() => fetchPolicies(page + 1)}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loading ? (
                        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
                    ) : null
                }
                ListEmptyComponent={
                    !loading ? (
                        <Text
                            style={{
                                textAlign: "center",
                                marginTop: 40,
                                color: "#94a3b8",
                                fontWeight: "600",
                            }}
                        >
                            정책이 없습니다.
                        </Text>
                    ) : null
                }
            />
        </View>
    );
}