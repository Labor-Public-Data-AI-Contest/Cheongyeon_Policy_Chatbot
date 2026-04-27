import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/Login.css";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [userid, setUserid] = useState("");
    const [userpassword, setUserpassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const res = await api.post("/api/auth/login", {
                userid,
                userpassword,
            });

            login(res.data.token);
            navigate("/");
        } catch (error) {
            const message = error.response?.data;

            if (message === "INVALID_LOGIN") {
                setErrorMsg("아이디 또는 비밀번호가 잘못되었습니다");
            } else {
                setErrorMsg("로그인 실패");
            }

            console.error(error);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>로그인</h2>

                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="아이디"
                        value={userid}
                        onChange={(e) => setUserid(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={userpassword}
                        onChange={(e) => setUserpassword(e.target.value)}
                    />

                    {errorMsg && <p className="error-msg">{errorMsg}</p>}

                    <button type="submit">로그인</button>
                </form>

                <div className="login-links">
                    <span onClick={() => navigate("/")}>챗봇으로 돌아가기</span>
                    <span onClick={() => navigate("/signup")}>회원가입</span>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;