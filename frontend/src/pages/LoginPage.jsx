import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/");
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>로그인</h2>

                <input type="text" placeholder="아이디" />
                <input type="password" placeholder="비밀번호" />

                <button onClick={handleLogin}>로그인</button>

                <div className="login-links">
                    <span onClick={() => navigate("/")}>챗봇으로 돌아가기</span>
                    <span onClick={() => navigate("/signup")}>회원가입</span>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;