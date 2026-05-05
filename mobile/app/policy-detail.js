import { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Linking,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import api from "../api/api";

export default function PolicyDetail() {
    const { id } = useLocalSearchParams();
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPolicyDetail();
    }, [id]);

    const fetchPolicyDetail = async () => {
        try {
            const res = await api.get(`/api/policies/${id}`);
            setPolicy(res.data);
        } catch (error) {
            console.log("정책 상세 불러오기 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    const hasValue = (value) => {
        if (!value) return false;

        const text = String(value).trim();

        return (
            text !== "" &&
            text !== "-" &&
            text !== "null" &&
            text !== "undefined" &&
            text !== "내용없음" &&
            text !== "정보 없음"
        );
    };

    const openUrl = async (url) => {
        if (!hasValue(url)) return;

        const fixedUrl = url.startsWith("http") ? url : `https://${url}`;

        try {
            await Linking.openURL(fixedUrl);
        } catch (error) {
            console.log("URL 열기 실패:", error);
        }
    };
    const formatPeriod = (start, end) => {
        if (!hasValue(start) && !hasValue(end)) return "상시";

        if (start === "1900-01-01" || end === "2262-04-11") {
            return "상시";
        }

        return `${hasValue(start) ? start : "-"} ~ ${hasValue(end) ? end : "-"}`;
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!policy) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>정책 정보를 불러올 수 없습니다.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
            <ScrollView>
                <View
                    style={{
                        paddingTop: 55,
                        paddingHorizontal: 22,
                        paddingBottom: 18,
                        backgroundColor: "white",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            if (router.canGoBack()) {
                                router.back();
                            } else {
                                router.replace("/policies");
                            }
                        }}
                    >
                        <Text style={{ fontSize: 24 }}>‹</Text>
                    </TouchableOpacity>

                    <Text style={{ fontSize: 18, fontWeight: "900" }}>
                        정책 상세정보
                    </Text>

                    <Text style={{ fontSize: 20 }}>🔖</Text>
                </View>

                <View
                    style={{
                        backgroundColor: "#2563eb",
                        paddingHorizontal: 22,
                        paddingTop: 45,
                        paddingBottom: 28,
                    }}
                >
                    <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
                        {hasValue(policy.keywords) &&
                            policy.keywords.split(",").map((item, index) => (
                                <Text key={index} style={styles.tag}>
                                    {item.trim()}
                                </Text>
                            ))}
                        {hasValue(policy.region) && (
                            <Text style={[styles.tag, { backgroundColor: "#22c55e" }]}>
                                {policy.region}
                            </Text>
                        )}
                    </View>

                    <Text style={styles.title}>{policy.title}</Text>
                </View>

                <View style={{ padding: 22 }}>
                    <View style={{ flexDirection: "row", gap: 12 }}>
                        <InfoBox
                            title="신청 기간"
                              value={formatPeriod(policy.applyStartDate, policy.applyEndDate)}

                        />
                        <InfoBox
                            title="연령"
                            value={`${policy.minAge ?? "-"}세 ~ ${policy.maxAge ?? "-"}세`}
                        />
                    </View>

                    <Section title="지원 내용">
                        <Text style={styles.body}>
                            {hasValue(policy.supportContent)
                                ? policy.supportContent
                                : hasValue(policy.description)
                                    ? policy.description
                                    : "정보가 없습니다."}
                        </Text>
                    </Section>

                    <Section title="신청 자격">
                        <InfoText label="거주 지역" value={policy.region} hasValue={hasValue} />
                        <InfoText label="소득 조건" value={policy.incomeCondition} hasValue={hasValue} />
                        <InfoText label="혼인 상태" value={policy.marriageStatus} hasValue={hasValue} />
                        <InfoText label="취업 조건" value={policy.employmentCondition} hasValue={hasValue} />
                        <InfoText label="학력 조건" value={policy.educationCondition} hasValue={hasValue} />
                        <InfoText label="추가 조건" value={policy.extraCondition} hasValue={hasValue} />
                    </Section>

                    {(hasValue(policy.applyMethod) || hasValue(policy.applyUrl)) && (
                        <Section title="신청 방법">
                            <View style={styles.card}>
                                <Text style={{ fontWeight: "900", marginBottom: 10 }}>
                                    📅 {hasValue(policy.applyStartDate) ? policy.applyStartDate : "-"} ~{" "}
                                    {hasValue(policy.applyEndDate) ? policy.applyEndDate : "-"}
                                </Text>

                                {hasValue(policy.applyMethod) && (
                                    <Text style={styles.body}>{policy.applyMethod}</Text>
                                )}

                                {hasValue(policy.applyUrl) && (
                                    <LinkButton
                                        label="신청 페이지 바로가기"
                                        onPress={() => openUrl(policy.applyUrl)}
                                    />
                                )}
                            </View>
                        </Section>
                    )}

                    {hasValue(policy.note) && (
                        <Section title="비고">
                            <Text style={styles.body}>{policy.note}</Text>
                        </Section>
                    )}

                    {(hasValue(policy.referenceUrl1) || hasValue(policy.referenceUrl2)) && (
                        <Section title="참고 링크">
                            {hasValue(policy.referenceUrl1) && (
                                <LinkButton
                                    label="참고 링크 1"
                                    onPress={() => openUrl(policy.referenceUrl1)}
                                />
                            )}

                            {hasValue(policy.referenceUrl2) && (
                                <LinkButton
                                    label="참고 링크 2"
                                    onPress={() => openUrl(policy.referenceUrl2)}
                                />
                            )}
                        </Section>
                    )}
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.chatBtn}
                onPress={() => router.push("/chat")}
            >
                <Text style={{ color: "white", fontSize: 24 }}>💬</Text>
            </TouchableOpacity>
        </View>
    );
}

function InfoBox({ title, value }) {
    return (
        <View style={styles.infoBox}>
            <Text style={{ color: "#2563eb", fontWeight: "800", marginBottom: 8 }}>
                {title}
            </Text>
            <Text style={{ fontWeight: "900" }}>{value}</Text>
        </View>
    );
}

function Section({ title, children }) {
    return (
        <View style={{ marginTop: 28 }}>
            <Text style={styles.sectionTitle}>
                <Text style={{ color: "#2563eb" }}>▌ </Text>
                {title}
            </Text>
            {children}
        </View>
    );
}

function InfoText({ label, value, hasValue }) {
    if (!hasValue(value)) return null;

    return (
        <View style={{ marginBottom: 14 }}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}

function LinkButton({ label, onPress }) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.linkBtn}>
            <Text style={{ color: "#2563eb", fontWeight: "900" }}>
                🔗 {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = {
    tag: {
        backgroundColor: "rgba(255,255,255,0.2)",
        color: "white",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        fontWeight: "700",
    },
    title: {
        color: "white",
        fontSize: 24,
        fontWeight: "900",
    },
    body: {
        color: "#475569",
        fontSize: 15,
        lineHeight: 24,
        fontWeight: "600",
    },
    infoBox: {
        flex: 1,
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "900",
        marginBottom: 14,
    },
    label: {
        color: "#94a3b8",
        fontWeight: "700",
        marginBottom: 4,
    },
    value: {
        color: "#111827",
        fontWeight: "800",
        lineHeight: 22,
    },
    linkBtn: {
        marginTop: 14,
        backgroundColor: "#eff6ff",
        padding: 12,
        borderRadius: 12,
    },
    chatBtn: {
        position: "absolute",
        right: 24,
        bottom: 35,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#4f46e5",
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
    },
};