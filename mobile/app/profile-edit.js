import { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform
} from "react-native";
import { router } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import regionMap from "../data/region.json";
import { useToast } from "../context/ToastContext";

const sidoList = Object.keys(regionMap);

export default function ProfileEdit() {
    const { showToast } = useToast();

    const [name, setName] = useState("");
    const [birth, setBirth] = useState("");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [inputSido, setInputSido] = useState("");
    const [selectedSido, setSelectedSido] = useState("");

    const [inputGu, setInputGu] = useState("");
    const [selectedGu, setSelectedGu] = useState("");

    const [showSidoList, setShowSidoList] = useState(false);
    const [showGuList, setShowGuList] = useState(false);

    const filteredSido = showSidoList
        ? inputSido
            ? sidoList.filter(item => item.startsWith(inputSido))
            : sidoList
        : [];

    const subList = selectedSido ? regionMap[selectedSido] || [] : [];

    const filteredGu = showGuList
        ? inputGu
            ? subList.filter(item => item.startsWith(inputGu))
            : subList
        : [];

    const loadUser = async () => {
        try {
            const token = await AsyncStorage.getItem("token");

            const res = await api.get("/api/user/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setName(res.data.name || "");

            if (res.data.birth) {
                setBirth(res.data.birth);
                setDate(new Date(res.data.birth));
            }

            if (res.data.address) {
                const parts = res.data.address.split(" ");
                const sido = parts[0] || "";
                const gu = parts.slice(1).join(" ") || "";

                setInputSido(sido);
                setSelectedSido(sido);
                setInputGu(gu);
                setSelectedGu(gu);
            }
        } catch (e) {
            console.log("프로필 조회 실패:", e.response?.data || e.message);
            showToast("프로필 정보를 불러오지 못했어요", "error");
        }
    };

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);

        if (selectedDate) {
            setDate(selectedDate);

            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
            const day = String(selectedDate.getDate()).padStart(2, "0");

            setBirth(`${year}-${month}-${day}`);
        }
    };

    const saveProfile = async () => {
        if (!name.trim()) {
            showToast("이름을 입력해주세요", "error");
            return;
        }

        if (!birth.trim()) {
            showToast("생년월일을 선택해주세요", "error");
            return;
        }

        if (!selectedSido || !selectedGu) {
            showToast("주소를 선택해주세요", "error");
            return;
        }

        try {
            const token = await AsyncStorage.getItem("token");

            await api.put(
                "/api/user/me",
                {
                    name,
                    birth,
                    address: `${selectedSido} ${selectedGu}`,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            showToast("프로필이 수정되었어요");

            setTimeout(() => {
                router.back();
            }, 900);
        } catch (e) {
            console.log("수정 실패:", e.response?.data || e.message);
            showToast("프로필 수정에 실패했어요", "error");
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 24, paddingTop: 55 }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 30 }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Text style={{ fontSize: 28 }}>‹</Text>
                    </TouchableOpacity>

                    <Text style={{
                        flex: 1,
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: "900",
                        marginRight: 28
                    }}>
                        프로필 수정
                    </Text>
                </View>

                <View style={cardStyle}>
                    <Text style={label}>이름</Text>
                    <TextInput
                        value={name}
                        onChangeText={setName}
                        style={input}
                        placeholder="이름 입력"
                        placeholderTextColor="#9ca3af"
                    />

                    <Text style={label}>생년월일</Text>

                    {Platform.OS === "web" ? (
                        <TextInput
                            value={birth}
                            onChangeText={setBirth}
                            style={input}
                            placeholder="생년월일을 입력해주세요"
                            placeholderTextColor="#9ca3af"
                        />
                    ) : (
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            style={dateInput}
                        >
                            <Text style={{ color: birth ? "#111827" : "#9ca3af" }}>
                                {birth || "생년월일을 선택해주세요"}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {showDatePicker && Platform.OS !== "web" && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            maximumDate={new Date()}
                            onChange={onChangeDate}
                        />
                    )}

                    <Text style={label}>주소</Text>

                    <View style={{ flexDirection: "row", gap: 8 }}>
                        <TextInput
                            value={inputSido}
                            onFocus={() => setShowSidoList(true)}
                            onChangeText={(text) => {
                                setInputSido(text);
                                setSelectedSido("");
                                setInputGu("");
                                setSelectedGu("");
                                setShowSidoList(true);
                                setShowGuList(false);
                            }}
                            placeholder="시/도 선택"
                            placeholderTextColor="#9ca3af"
                            style={[input, { flex: 1, marginBottom: 0 }]}
                        />

                        <TextInput
                            value={inputGu}
                            onFocus={() => {
                                if (selectedSido) {
                                    setShowGuList(true);
                                }
                            }}
                            onChangeText={(text) => {
                                setInputGu(text);
                                setSelectedGu("");
                                setShowGuList(true);
                            }}
                            placeholder="구/시 선택"
                            placeholderTextColor="#9ca3af"
                            editable={!!selectedSido}
                            style={[
                                input,
                                {
                                    flex: 1,
                                    marginBottom: 0,
                                    opacity: selectedSido ? 1 : 0.55
                                }
                            ]}
                        />
                    </View>

                    {filteredSido.length > 0 && (
                        <View style={dropdownStyle}>
                            {filteredSido.map(item => (
                                <TouchableOpacity
                                    key={item}
                                    onPress={() => {
                                        setInputSido(item);
                                        setSelectedSido(item);
                                        setInputGu("");
                                        setSelectedGu("");
                                        setShowSidoList(false);
                                        setShowGuList(true);
                                    }}
                                    style={dropdownItemStyle}
                                >
                                    <Text style={{ fontWeight: "900", color: "#2563eb" }}>
                                        {item}
                                    </Text>
                                    <Text style={{ color: "#64748b", fontSize: 12 }}>
                                        {item} 전체
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {filteredGu.length > 0 && selectedSido && (
                        <View style={dropdownStyle}>
                            {filteredGu.map(item => (
                                <TouchableOpacity
                                    key={item}
                                    onPress={() => {
                                        setInputGu(item);
                                        setSelectedGu(item);
                                        setShowGuList(false);
                                    }}
                                    style={dropdownItemStyle}
                                >
                                    <Text style={{ fontWeight: "900" }}>
                                        {item}
                                    </Text>
                                    <Text style={{ color: "#64748b", fontSize: 12 }}>
                                        {selectedSido} {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={saveProfile}
                        style={{
                            marginTop: 30,
                            height: 54,
                            borderRadius: 14,
                            backgroundColor: "#2563eb",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Text style={{ color: "white", fontWeight: "900", fontSize: 16 }}>
                            저장하기
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const cardStyle = {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
};

const label = {
    fontWeight: "800",
    marginBottom: 8,
    color: "#111827",
};

const input = {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 14,
    marginBottom: 18,
    color: "#111827",
};

const dateInput = {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 14,
    justifyContent: "center",
    marginBottom: 18,
};

const dropdownStyle = {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 8,
    marginTop: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e5e7eb",
};

const dropdownItemStyle = {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
};