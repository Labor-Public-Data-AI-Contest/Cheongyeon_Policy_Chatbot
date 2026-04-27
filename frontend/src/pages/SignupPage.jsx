import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";

function SignupPage() {
    const navigate = useNavigate();

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPw, setConfirmPw] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [age, setAge] = useState("");

    // 비밀번호 규칙: 숫자 + 영어 + 특수문자 + 8자 이상
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
    const isPasswordValid = passwordRegex.test(password);
    const isPasswordSame = password === confirmPw;

    const handleSignup = () => {
        // 필수 입력 체크
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

        // 나이 제한 
        if (Number(age) < 1 || Number(age) > 100) {
            alert("나이는 1~100 사이로 입력해주세요.");
            return;
        }

        // 비밀번호 규칙 체크
        if (!isPasswordValid) {
            alert("비밀번호는 영어, 특수문자를 포함해 8자 이상이어야 합니다.");
            return;
        }

        // 비밀번호 일치
        if (!isPasswordSame) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        console.log({
            userId,
            password,
            name,
            address,
            age,
        });

        alert("회원가입 완료!");
        navigate("/login");
    };

    return (
        <div className="signup-page">
            <div className="signup-card">
                <h2>회원가입</h2>

                <input
                    type="text"
                    placeholder="아이디 *"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="비밀번호 *"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {password && !isPasswordValid && (
                    <p className="error-text">
                        숫자 + 영어 + 특수문자 포함 8자 이상
                    </p>
                )}

                <input
                    type="password"
                    placeholder="비밀번호 확인 *"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                />

                {confirmPw && !isPasswordSame && (
                    <p className="error-text">비밀번호가 일치하지 않습니다.</p>
                )}

                <input
                    type="text"
                    placeholder="이름 *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="주소 *"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="나이 (1~100) *"
                    value={age}
                    min="1"
                    max="100"
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || Number(value) <= 100) {
                            setAge(value);
                        }
                    }}
                />

                <button onClick={handleSignup}>가입하기</button>

                <div className="signup-links">
                    <span onClick={() => navigate("/login")}>로그인으로 돌아가기</span>
                    <span onClick={() => navigate("/")}>챗봇으로 돌아가기</span>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;