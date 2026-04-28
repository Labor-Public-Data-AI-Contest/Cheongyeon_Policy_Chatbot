import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";
import api from "../api/axios";

function SignupPage() {
    const navigate = useNavigate();

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [age, setAge] = useState("");

    const [isIdChecked, setIsIdChecked] = useState(false);
    const [isIdAvailable, setIsIdAvailable] = useState(false);

    const openAddress = () => {
        if (!window.daum || !window.daum.Postcode) {
            alert("주소 검색 로딩 중입니다.");
            return;
        }

        new window.daum.Postcode({
            oncomplete: function (data) {
                setAddress(data.address);
            }
        }).open();
    };

    const checkUserId = async () => {
        if (!userId.trim()) {
            alert("아이디를 입력해주세요.");
            return;
        }

        try {
            const res = await api.get("/api/auth/check-id", {
                params: { userid: userId }
            });

            if (res.data) {
                alert("이미 사용 중인 아이디입니다.");
                setIsIdChecked(true);
                setIsIdAvailable(false);
            } else {
                alert("사용 가능한 아이디입니다.");
                setIsIdChecked(true);
                setIsIdAvailable(true);
            }
        } catch (e) {
            alert("중복 확인 실패");
        }
    };

    const handleSignup = async () => {
        if (
            !userId.trim() ||
            !password.trim() ||
            !confirmPw.trim() ||
            !name.trim() ||
            !address.trim() ||
            !age.trim()
        ) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        if (!isIdChecked || !isIdAvailable) {
            alert("아이디 중복 확인을 해주세요.");
            return;
        }

        try {
            await api.post("/api/auth/signup", {
                userid: userId,
                userpassword: password,
                name,
                address: `${address} ${detailAddress}`.trim(),
                age: Number(age),
            });

            alert("회원가입 완료!");
            navigate("/login");
        } catch (error) {
            alert("회원가입 실패");
        }
    };

    return (
        <div className="signup-page">
            <div className="signup-card">
                <h2>회원가입</h2>

                <div className="id-check-row">
                    <input
                        type="text"
                        placeholder="아이디 *"
                        value={userId}
                        onChange={(e) => {
                            setUserId(e.target.value);
                            setIsIdChecked(false);
                            setIsIdAvailable(false);
                        }}
                    />
                    <button type="button" onClick={checkUserId}>
                        중복확인
                    </button>
                </div>

                {isIdChecked && isIdAvailable && (
                    <p className="success-text">사용 가능한 아이디입니다.</p>
                )}

                {isIdChecked && !isIdAvailable && (
                    <p className="error-text">이미 사용 중인 아이디입니다.</p>
                )}

                <input
                    type="password"
                    placeholder="비밀번호 *"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="비밀번호 확인 *"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="이름 *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <div className="address-row">
                    <input
                        type="text"
                        placeholder="주소 *"
                        value={address}
                        readOnly
                    />
                    <button type="button" onClick={openAddress}>
                        찾기
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="상세주소"
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="나이 (1~100) *"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />

                <button onClick={handleSignup}>가입하기</button>

                <div className="signup-links">
                    <span onClick={() => navigate("/login")}>로그인</span>
                    <span onClick={() => navigate("/")}>챗봇</span>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;