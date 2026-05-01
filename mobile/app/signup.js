import { useState } from "react";
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
import regionMap from "../data/region.json";
import api from "../api/api";

const sidoList = Object.keys(regionMap);

export default function Signup() {
    const [name, setName] = useState("");

    const [birth, setBirth] = useState("");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [inputSido, setInputSido] = useState("");
    const [selectedSido, setSelectedSido] = useState("");

    const [inputGu, setInputGu] = useState("");
    const [selectedGu, setSelectedGu] = useState("");

    const [agree, setAgree] = useState(false);

    const filteredSido = inputSido
        ? sidoList.filter(item => item.startsWith(inputSido))
        : [];

    const subList = selectedSido ? regionMap[selectedSido] || [] : [];

    const filteredGu = inputGu
        ? subList.filter(item => item.startsWith(inputGu))
        : subList;

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);

        if (selectedDate) {
            setDate(selectedDate);

            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
            const day = String(selectedDate.getDate()).padStart(2, "0");

            setBirth(`${year}.${month}.${day}`);
        }
    };

    const [userid, setUserid] = useState("");
    const [userpassword, setUserpassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [idChecked, setIdChecked] = useState(false);
    const [idMessage, setIdMessage] = useState("");

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 24, paddingTop: 55 }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 28 }}>
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
                        회원가입
                    </Text>
                </View>

                <Text style={{ fontSize: 24, fontWeight: "900", lineHeight: 32 }}>
                    청년플랫폼에 오신 것을{"\n"}
                    환영합니다! 😊
                </Text>

                <Text style={{ color: "#64748b", marginTop: 10, lineHeight: 21, marginBottom: 30 }}>
                    맞춤형 정책 정보를 받기 위해 기본 정보를 입력해주세요.
                </Text>

                <Text style={labelStyle}>아이디</Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                    <TextInput
                        value={userid}
                        onChangeText={(text) => {
                            setUserid(text);
                            setIdChecked(false);
                            setIdMessage("");
                        }}
                        placeholder="아이디를 입력해주세요"
                        style={[inputStyle, { flex: 1 }]}
                    />

                    <TouchableOpacity
                        onPress={async () => {
                            if (!userid.trim()) {
                                setIdMessage("아이디를 입력해주세요.");
                                return;
                            }

                            try {
                                const res = await fetch(`http://localhost:8080/api/auth/check-id?userid=${userid}`);
                                const exists = await res.json();

                                if (exists) {
                                    setIdChecked(false);
                                    setIdMessage("이미 사용 중인 아이디입니다.");
                                } else {
                                    setIdChecked(true);
                                    setIdMessage("사용 가능한 아이디입니다.");
                                }
                            } catch (e) {
                                setIdMessage("중복 확인에 실패했습니다.");
                            }
                        }}
                        style={{
                            height: 54,
                            paddingHorizontal: 14,
                            borderRadius: 12,
                            backgroundColor: "#2563eb",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <Text style={{ color: "white", fontWeight: "800" }}>중복확인</Text>
                    </TouchableOpacity>
                </View>

                {!!idMessage && (
                    <Text style={{
                        color: idChecked ? "#2563eb" : "#ef4444",
                        fontSize: 12,
                        marginBottom: 12
                    }}>
                        {idMessage}
                    </Text>
                )}

                <Text style={[labelStyle, { marginTop: 12 }]}>비밀번호</Text>
                <TextInput
                    value={userpassword}
                    onChangeText={setUserpassword}
                    placeholder="영문+숫자 포함 8자리 이상"
                    secureTextEntry
                    style={inputStyle}
                />

                <Text style={[labelStyle, { marginTop: 12 }]}>비밀번호 확인</Text>
                <TextInput
                    value={passwordCheck}
                    onChangeText={setPasswordCheck}
                    placeholder="비밀번호를 다시 입력해주세요"
                    secureTextEntry
                    style={inputStyle}
                />

                {userpassword.length > 0 && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(userpassword) && (
                    <Text style={{ color: "#ef4444", fontSize: 12, marginBottom: 8 }}>
                        비밀번호는 영문과 숫자를 포함해 8자리 이상이어야 합니다.
                    </Text>
                )}

                {passwordCheck.length > 0 && userpassword !== passwordCheck && (
                    <Text style={{ color: "#ef4444", fontSize: 12, marginBottom: 8 }}>
                        비밀번호가 일치하지 않습니다.
                    </Text>
                )}

                <Text style={labelStyle}>이름</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="이름을 입력해주세요"
                    style={inputStyle}
                />

                <Text style={[labelStyle, { marginTop: 20 }]}>생년월일</Text>

                {Platform.OS === "web" ? (
                    <TextInput
                        value={birth}
                        onChangeText={setBirth}
                        placeholder="1999.01.01"
                        style={inputStyle}
                    />
                ) : (
                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={dateInputStyle}
                    >
                        <Text style={{ color: birth ? "black" : "#9ca3af" }}>
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

                <Text style={[labelStyle, { marginTop: 28, marginBottom: 4 }]}>거주 지역</Text>
                <Text style={{ color: "#2563eb", fontSize: 12, fontWeight: "700", marginBottom: 10 }}>
                    주민등록지상 주소를 입력해주세요
                </Text>

                <View style={{ flexDirection: "row", gap: 8 }}>
                    <TextInput
                        value={inputSido}
                        onChangeText={(text) => {
                            setInputSido(text);
                            setSelectedSido("");
                            setInputGu("");
                            setSelectedGu("");
                        }}
                        placeholder="시/도 선택"
                        style={[
                            inputStyle,
                            {
                                flex: 1,
                                marginBottom: 0,
                                borderColor: inputSido ? "#2563eb" : "#e5e7eb"
                            }
                        ]}
                    />

                    <TextInput
                        value={inputGu}
                        onChangeText={(text) => {
                            setInputGu(text);
                            setSelectedGu("");
                        }}
                        placeholder="구/시 선택"
                        editable={!!selectedSido}
                        style={[
                            inputStyle,
                            {
                                flex: 1,
                                marginBottom: 0,
                                opacity: selectedSido ? 1 : 0.55
                            }
                        ]}
                    />
                </View>

                {filteredSido.length > 0 && !selectedSido && (
                    <View style={dropdownStyle}>
                        {filteredSido.map(item => (
                            <TouchableOpacity
                                key={item}
                                onPress={() => {
                                    setInputSido(item);
                                    setSelectedSido(item);
                                    setInputGu("");
                                    setSelectedGu("");
                                }}
                                style={dropdownItemStyle}
                            >
                                <Text style={{ fontWeight: "800", color: "#2563eb" }}>{item}</Text>
                                <Text style={{ color: "#64748b", fontSize: 12 }}>{item} 전체</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {selectedSido && filteredGu.length > 0 && !selectedGu && (
                    <View style={dropdownStyle}>
                        {filteredGu.map(item => (
                            <TouchableOpacity
                                key={item}
                                onPress={() => {
                                    setInputGu(item);
                                    setSelectedGu(item);
                                }}
                                style={dropdownItemStyle}
                            >
                                <Text style={{ fontWeight: "800" }}>{item}</Text>
                                <Text style={{ color: "#64748b", fontSize: 12 }}>
                                    {selectedSido} {item}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={{ minHeight: 80 }} />

                <TouchableOpacity
                    onPress={() => setAgree(!agree)}
                    style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
                >
                    <View style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        backgroundColor: agree ? "#2563eb" : "white",
                        borderWidth: 1,
                        borderColor: agree ? "#2563eb" : "#cbd5e1",
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: 8
                    }}>
                        {agree && <Text style={{ color: "white", fontSize: 12 }}>✓</Text>}
                    </View>

                    <Text style={{ color: "#475569" }}>
                        개인정보 수집 및 이용에 동의합니다 (필수)
                    </Text>
                </TouchableOpacity>


                <TouchableOpacity
                    disabled={
                        !agree ||
                        !idChecked ||
                        !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(userpassword) ||
                        userpassword !== passwordCheck
                    }
                    style={{
                        height: 56,
                        borderRadius: 14,
                        backgroundColor:
                            agree &&
                                idChecked &&
                                /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(userpassword) &&
                                userpassword === passwordCheck
                                ? "#2563eb"
                                : "#cbd5e1",
                        justifyContent: "center",
                        alignItems: "center",
                        shadowColor: "#2563eb",
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                        elevation: 5
                    }}
                >
                    <Text style={{ color: "white", fontSize: 18, fontWeight: "800" }}>
                        회원가입 완료
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const labelStyle = {
    fontWeight: "700",
    marginBottom: 8,
};

const inputStyle = {
    height: 54,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    marginBottom: 8,
};

const dateInputStyle = {
    height: 54,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    justifyContent: "center",
    marginBottom: 8,
};

const dropdownStyle = {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 8,
    marginTop: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
};

const dropdownItemStyle = {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
};